import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddVirsh from "./AddVirsh";

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
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddVirsh", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "maas_name", value: "MAAS" }],
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
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
  });

  it("fetches the necessary data on load", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddVirsh clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddVirsh clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("displays a message if virsh is not supported", () => {
    state.general.powerTypes.data = [];
    state.general.powerTypes.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddVirsh clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='virsh-unsupported']").exists()).toBe(
      true
    );
  });

  it("can handle saving a virsh KVM", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddVirsh clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        name: "my-favourite-kvm",
        pool: 0,
        // power_parameters should be flattened before being sent through the websocket
        power_parameters: {
          power_address: "192.68.1.1",
          power_pass: "password",
        },
        type: PodType.VIRSH,
        zone: 0,
      })
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
          power_address: "192.68.1.1",
          power_pass: "password",
          type: PodType.VIRSH,
          zone: 0,
        },
      },
    });
  });
});
