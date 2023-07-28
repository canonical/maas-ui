import AddChassisForm from "../AddChassisForm";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope, PowerFieldType } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("AddChassisFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ name: "maas" })],
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          loaded: true,
        }),
      }),
    });
  });

  it("can render", () => {
    renderWithBrowserRouter(
      <AddChassisForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/chassis/add", state }
    );

    expect(
      screen.getByRole("combobox", { name: "Domain" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "maas" })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Power type" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save chassis" })
    ).toBeInTheDocument();
  });

  it("does not show power type fields that are scoped to nodes", async () => {
    state.general.powerTypes.data.push(
      powerTypeFactory({
        name: PowerTypeNames.VIRSH,
        description: "Virsh (virtual systems)",
        fields: [
          powerFieldFactory({
            name: "power_address",
            label: "Address",
            required: true,
            field_type: PowerFieldType.STRING,
            choices: [],
            default: "",
            scope: PowerFieldScope.BMC,
          }),
          powerFieldFactory({
            name: "power_pass",
            label: "Password (optional)",
            required: false,
            field_type: PowerFieldType.PASSWORD,
            choices: [],
            default: "",
            scope: PowerFieldScope.BMC,
          }),
          powerFieldFactory({
            name: "power_id",
            label: "Virsh VM ID",
            required: true,
            field_type: PowerFieldType.STRING,
            choices: [],
            default: "",
            scope: PowerFieldScope.NODE, // Should not show
          }),
        ],
        can_probe: true,
      })
    );

    renderWithBrowserRouter(
      <AddChassisForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/chassis/add", state }
    );

    const powerTypeSelect = screen.getByRole("combobox", {
      name: "Power type",
    });
    await userEvent.selectOptions(powerTypeSelect, PowerTypeNames.VIRSH);

    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Virsh VM ID/i)).not.toBeInTheDocument();
  });
});
