import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import AddVirsh from "../AddVirsh";

import { ConfigNames } from "app/store/config/types";
import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  podState as podStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("AddVirshFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.MAAS_NAME, value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        genericActions: zoneGenericActionsFactory({ fetch: "success" }),
        items: [zoneFactory()],
      }),
    });
  });

  it("does not show power type fields that are scoped to nodes", () => {
    const powerTypes = [
      powerTypeFactory({
        description: "Virsh (virtual systems)",
        fields: [
          powerFieldFactory({ name: "field1", scope: PowerFieldScope.BMC }),
          powerFieldFactory({ name: "field2", scope: PowerFieldScope.NODE }),
        ],
        name: PowerTypeNames.VIRSH,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);

    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      route: "/machines/chassis/add",
      store: store,
    });

    expect(screen.getByLabelText(/Field1/i)).toBeTruthy();
    expect(screen.queryByLabelText(/Field2/i)).toBeFalsy();
    expect(screen.getByRole("button", { name: /save/i })).toBeTruthy();
  });
});
