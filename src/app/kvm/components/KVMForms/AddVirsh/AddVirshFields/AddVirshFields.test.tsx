import AddVirsh from "../AddVirsh";

import { ConfigNames } from "@/app/store/config/types";
import { PowerTypeNames } from "@/app/store/general/constants";
import { PowerFieldScope } from "@/app/store/general/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("AddVirshFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [{ name: ConfigNames.MAAS_NAME, value: "MAAS" }],
      }),
      general: factory.generalState({
        powerTypes: factory.powerTypesState({
          data: [],
          loaded: true,
        }),
      }),
      pod: factory.podState({
        items: [],
        loaded: true,
        loading: false,
        saved: false,
        saving: false,
      }),
      resourcepool: factory.resourcePoolState({
        items: [factory.resourcePool()],
        loaded: true,
      }),
      zone: factory.zoneState({
        genericActions: factory.zoneGenericActions({ fetch: "success" }),
        items: [factory.zone()],
      }),
    });
  });

  it("does not show power type fields that are scoped to nodes", () => {
    const powerTypes = [
      factory.powerType({
        description: "Virsh (virtual systems)",
        fields: [
          factory.powerField({
            name: "field1",
            scope: PowerFieldScope.BMC,
            label: "test-powerfield-label-1",
          }),
          factory.powerField({
            name: "field2",
            scope: PowerFieldScope.NODE,
            label: "test-powerfield-label-2",
          }),
        ],
        name: PowerTypeNames.VIRSH,
      }),
    ];
    state.general.powerTypes.data = powerTypes;

    renderWithBrowserRouter(<AddVirsh clearSidePanelContent={vi.fn()} />, {
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
