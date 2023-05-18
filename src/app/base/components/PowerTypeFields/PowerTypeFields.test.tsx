import { Formik } from "formik";

import PowerTypeFields from "./PowerTypeFields";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope, PowerFieldType } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore, screen, userEvent, within } from "testing/utils";

describe("PowerTypeFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          loaded: true,
        }),
      }),
    });
  });

  it("correctly generates power options from power type", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({
            field_type: PowerFieldType.STRING,
            label: "Required text",
            name: "field1",
            required: true,
          }),
          powerFieldFactory({
            field_type: PowerFieldType.STRING,
            label: "Non-required text",
            name: "field2",
            required: false,
          }),
          powerFieldFactory({
            choices: [
              ["choice1", "Choice 1"],
              ["choice2", "Choice 2"],
            ],
            name: "field3",
            label: "Select with choices",
            field_type: PowerFieldType.CHOICE,
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{ power_type: PowerTypeNames.MANUAL }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: "Required text" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Required text" })
    ).toBeRequired();
    expect(
      screen.getByRole("textbox", { name: "Non-required text" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Non-required text" })
    ).not.toBeRequired();

    const selectWithChoices = screen.getByRole("combobox", {
      name: "Select with choices",
    });
    expect(selectWithChoices).toBeInTheDocument();
    powerTypes[0].fields[2].choices.forEach((choice) => {
      expect(
        within(selectWithChoices).getByRole("option", { name: choice[1] })
      ).toBeInTheDocument();
    });
  });

  it("does not show select if showSelect is false", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ name: "field1" }),
          powerFieldFactory({ name: "field2" }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{ power_type: PowerTypeNames.MANUAL }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields showSelect={false} />
      </Formik>,
      { state }
    );

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("can limit the fields to show based on their scope", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({
            name: "field1",
            label: "Field 1",
            scope: PowerFieldScope.NODE,
          }),
          powerFieldFactory({
            name: "field2",
            label: "Field 2",
            scope: PowerFieldScope.BMC,
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{ power_type: PowerTypeNames.MANUAL }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields fieldScopes={[PowerFieldScope.NODE]} />
      </Formik>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: "Field 1" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Field 2" })
    ).not.toBeInTheDocument();
  });

  it("can only show power types suitable for chassis", () => {
    const powerTypes = [
      powerTypeFactory({
        can_probe: true,
        description: "virsh",
        fields: [],
        name: PowerTypeNames.VIRSH,
      }),
      powerTypeFactory({
        can_probe: false,
        description: "manual",
        fields: [],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik initialValues={{ power_type: "" }} onSubmit={jest.fn()}>
        <PowerTypeFields forChassis />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("option", { name: "virsh" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "manual" })
    ).not.toBeInTheDocument();
  });

  it("can be given different values for formik field names", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ name: "parameter1", label: "Parameter 1" }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{
          powerParameters: {},
          powerType: PowerTypeNames.MANUAL,
        }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields
          powerParametersValueName="powerParameters"
          powerTypeValueName="powerType"
        />
      </Formik>,
      { state }
    );

    expect(
      screen.getByRole("combobox", { name: "Power type" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Parameter 1" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Parameter 1" })).toHaveProperty(
      "name",
      "powerParameters.parameter1"
    );
  });

  it("can disable the power type select", () => {
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {},
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields disableSelect />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("combobox", { name: "Power type" })).toBeDisabled();
  });

  it("resets the fields of the selected power type on change", async () => {
    // Mock two power types that share a power parameter "parameter1"
    const powerTypes = [
      powerTypeFactory({
        description: "manual",
        fields: [
          powerFieldFactory({
            default: "default1",
            name: "parameter1",
            label: "Parameter 1",
          }),
          powerFieldFactory({
            default: "default2",
            name: "parameter2",
            label: "Parameter 2",
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
      powerTypeFactory({
        description: "virsh",
        fields: [
          powerFieldFactory({
            default: "default3",
            name: "parameter1",
            label: "Parameter 1",
          }),
          powerFieldFactory({
            default: "default4",
            name: "parameter3",
            label: "Parameter 3",
          }),
        ],
        name: PowerTypeNames.VIRSH,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {
            parameter1: "changed parameter1",
            parameter2: "changed parameter2",
            parameter3: "default4",
          },
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    // Fields should have changed parameters
    expect(screen.getByRole("textbox", { name: "Parameter 1" })).toHaveValue(
      "changed parameter1"
    );
    expect(screen.getByRole("textbox", { name: "Parameter 2" })).toHaveValue(
      "changed parameter2"
    );

    // Change power type to "virsh"
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Power type" }),
      screen.getByRole("option", { name: "virsh" })
    );

    // Fields of selected power type should be reset to defaults
    expect(screen.getByRole("textbox", { name: "Parameter 1" })).toHaveValue(
      "default3"
    );
    expect(
      screen.queryByRole("textbox", { name: "Parameter 2" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Parameter 3" })).toHaveValue(
      "default4"
    );
  });

  it("renders LXD power fields with custom props if selected", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ name: "certificate" }),
          powerFieldFactory({ name: "key" }),
          powerFieldFactory({ name: "password", label: "Password" }),
        ],
        name: PowerTypeNames.LXD,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {},
          power_type: PowerTypeNames.LXD,
        }}
        onSubmit={jest.fn()}
      >
        <PowerTypeFields
          customFieldProps={{ lxd: { initialShouldGenerateCert: false } }}
        />
      </Formik>,
      { state }
    );

    expect(
      screen.getByRole("textbox", { name: "Password" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Generate new certificate" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Generate new certificate" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Provide certificate and private key" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Provide certificate and private key" })
    ).toBeChecked();
    expect(
      screen.getByRole("textbox", { name: "Upload certificate" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Upload private key" })
    ).toBeInTheDocument();
  });
});
