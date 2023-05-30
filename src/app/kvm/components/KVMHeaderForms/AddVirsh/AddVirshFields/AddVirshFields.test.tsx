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

    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={jest.fn()} />, {
      state,
      route: "/machines/chassis/add",
    });

    expect(
      screen.getByRole("textbox", { name: /test-powerfield-label-1/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: /test-powerfield-label-2/i })
    ).not.toBeInTheDocument();
  });
});
