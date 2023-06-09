import configureStore from "redux-mock-store";

import AddVirsh from "./AddVirsh";

import { ConfigNames } from "app/store/config/types";
import { actions as generalActions } from "app/store/general";
import { PodType } from "app/store/pod/constants";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import type { RootState } from "app/store/root/types";
import { actions as zoneActions } from "app/store/zone";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerTypesState as powerTypesStateFactory,
  powerType as powerTypeFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("AddVirsh", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.MAAS_NAME, value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: PodType.VIRSH,
              fields: [
                powerFieldFactory({ name: "power_address" }),
                powerFieldFactory({ name: "power_pass" }),
              ],
            }),
          ],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory({ id: 0 })],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [zoneFactory({ id: 0 })],
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      route: "/kvm/add",
      store,
    });
    const expectedActions = [
      generalActions.fetchPowerTypes(),
      resourcePoolActions.fetch(),
      zoneActions.fetch(),
    ];
    const actualActions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(
        actualActions.find(
          (actualAction) => actualAction.type === expectedAction.type
        )
      ).toStrictEqual(expectedAction);
    });
  });

  it("displays a spinner if data hasn't loaded yet", () => {
    state.general.powerTypes.loaded = false;
    const store = mockStore(state);
    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      route: "/kvm/add",
      store,
    });
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays a message if virsh is not supported", () => {
    state.general.powerTypes.data = [];
    state.general.powerTypes.loaded = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      route: "/kvm/add",
      store,
    });
    expect(screen.getByTestId("virsh-unsupported")).toBeInTheDocument();
  });

  it("can handle saving a virsh KVM", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      route: "/kvm/add",
      store,
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: /Name/i }),
      "my-favourite-kvm"
    );
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /Resource pool/i }),
      "0"
    );
    await userEvent.selectOptions(screen.getByLabelText(/Zone/i), "0");

    await userEvent.click(
      screen.getByRole("button", { name: /Save Virsh host/i })
    );

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          name: "my-favourite-kvm",
          pool: 0,
          power_address: "auto",
          power_pass: "auto",
          type: PodType.VIRSH,
          zone: 0,
        },
      },
    });
  });
});
