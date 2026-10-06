import { Formik } from "formik";

import PowerTypeFields, {
  POWER_VERIFY_SSL_FIELD_NAME,
} from "./PowerTypeFields";

import { PowerTypeNames } from "@/app/store/general/constants";
import { PowerFieldScope, PowerFieldType } from "@/app/store/general/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { powerTypesResolvers } from "@/testing/resolvers/powerTypes";
import { systemResolvers } from "@/testing/resolvers/system";
import {
  expectTooltipOnHover,
  renderWithMockStore,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  waitForLoading,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  powerTypesResolvers.listPowerTypes.handler(),
  systemResolvers.getSystemInfo.handler()
);

describe("PowerTypeFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        powerTypes: factory.powerTypesState({
          loaded: true,
        }),
      }),
    });
  });

  it("correctly generates power options from power type", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({
            field_type: PowerFieldType.STRING,
            label: "Required text",
            name: "field1",
            required: true,
          }),
          factory.powerField({
            field_type: PowerFieldType.STRING,
            label: "Non-required text",
            name: "field2",
            required: false,
          }),
          factory.powerField({
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
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

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

    // Go through each choice in the last field and ensure it's listed as a select option
    powerTypes[0].fields[2].choices.forEach((choice) => {
      expect(
        // Index 1 is the label for this option
        within(selectWithChoices).getByRole("option", { name: choice[1] })
      ).toBeInTheDocument();
    });
  });

  it("does not show select if showSelect is false", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({ name: "field1" }),
          factory.powerField({ name: "field2" }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{ power_type: PowerTypeNames.MANUAL }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields showSelect={false} />
      </Formik>,
      { state }
    );

    await waitForLoading();

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("can limit the fields to show based on their scope", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({
            name: "field1",
            label: "Field 1",
            scope: PowerFieldScope.NODE,
          }),
          factory.powerField({
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
        onSubmit={vi.fn()}
      >
        <PowerTypeFields fieldScopes={[PowerFieldScope.NODE]} />
      </Formik>,
      { state }
    );

    await waitForLoading();

    expect(
      screen.getByRole("textbox", { name: "Field 1" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Field 2" })
    ).not.toBeInTheDocument();
  });

  it("can only show power types suitable for chassis", async () => {
    const powerTypes = [
      factory.powerType({
        can_probe: true,
        description: "virsh",
        fields: [],
        name: PowerTypeNames.VIRSH,
      }),
      factory.powerType({
        can_probe: false,
        description: "manual",
        fields: [],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik initialValues={{ power_type: "" }} onSubmit={vi.fn()}>
        <PowerTypeFields forChassis />
      </Formik>,
      { state }
    );

    await waitForLoading();

    await userEvent.click(screen.getByRole("button", { name: "Power type" }));

    expect(screen.getByRole("option", { name: "virsh" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "manual" })
    ).not.toBeInTheDocument();
  });

  it("can be given different values for formik field names", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({ name: "parameter1", label: "Parameter 1" }),
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
        onSubmit={vi.fn()}
      >
        <PowerTypeFields
          powerParametersValueName="powerParameters"
          powerTypeValueName="powerType"
        />
      </Formik>,
      { state }
    );

    await waitForLoading();

    expect(
      screen.getByRole("button", { name: "Power type" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Parameter 1" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Parameter 1" })).toHaveProperty(
      "name",
      "powerParameters.parameter1"
    );
  });

  it("can disable the power type select", async () => {
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {},
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields disableSelect />
      </Formik>,
      { state }
    );

    await waitForLoading();

    expect(screen.getByRole("button", { name: "Power type" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("resets the fields of the selected power type on change", async () => {
    // Mock two power types that share a power parameter "parameter1"
    const powerTypes = [
      factory.powerType({
        description: "manual",
        fields: [
          factory.powerField({
            default: "default1",
            name: "parameter1",
            label: "Parameter 1",
          }),
          factory.powerField({
            default: "default2",
            name: "parameter2",
            label: "Parameter 2",
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
      factory.powerType({
        description: "virsh",
        fields: [
          factory.powerField({
            default: "default3",
            name: "parameter1",
            label: "Parameter 1",
          }),
          factory.powerField({
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
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

    // Fields should have changed parameters
    expect(screen.getByRole("textbox", { name: "Parameter 1" })).toHaveValue(
      "changed parameter1"
    );
    expect(screen.getByRole("textbox", { name: "Parameter 2" })).toHaveValue(
      "changed parameter2"
    );

    // Change power type to "virsh"
    await userEvent.click(screen.getByRole("button", { name: "Power type" }));
    await userEvent.click(screen.getByRole("option", { name: "virsh" }));

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

  it("renders LXD power fields with custom props if selected", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({ name: "certificate" }),
          factory.powerField({ name: "key" }),
          factory.powerField({ name: "password", label: "Password" }),
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
        onSubmit={vi.fn()}
      >
        <PowerTypeFields
          customFieldProps={{ lxd: { initialShouldGenerateCert: false } }}
        />
      </Formik>,
      { state }
    );

    await waitForLoading();

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

  it("disables power types not supported by FIPS when FIPS is active and shows reasons", async () => {
    const fipsUnsupportedPowerTypesResponse = {
      items: [
        factory.powerTypeV3({
          name: "manual",
          description: "Manual",
          fips_supported: true,
          fips_unsupported_reason: undefined,
        }),
        factory.powerTypeV3({
          name: "amt",
          description: "Intel AMT",
          fips_supported: false,
          fips_unsupported_reason: "uses non-approved cryptography",
        }),
        factory.powerTypeV3({
          name: "apc",
          description: "APC PDU",
          fips_supported: false,
          fips_unsupported_reason: "network vulnerability",
        }),
      ],
    };

    mockServer.use(
      powerTypesResolvers.listPowerTypes.handler(
        fipsUnsupportedPowerTypesResponse
      ),
      systemResolvers.getSystemInfo.handler(
        factory.systemInfo({ fips_active: true })
      )
    );

    const powerTypes = [
      factory.powerType({
        name: "manual",
        description: "Manual",
      }),
      factory.powerType({
        name: "amt",
        description: "Intel AMT",
      }),
      factory.powerType({
        name: "apc",
        description: "APC PDU",
      }),
    ];
    state.general.powerTypes.data = powerTypes;

    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {},
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

    await userEvent.click(screen.getByRole("button", { name: "Power type" }));

    // FIPS-unsupported power types should show their reason as a tooltip
    // (hover the tooltip's inner wrapper, since it holds the hover handlers)
    await expectTooltipOnHover(
      within(screen.getByRole("option", { name: "Intel AMT" })).getByText(
        "Intel AMT"
      ).parentElement,
      "Disabled due to uses non-approved cryptography"
    );
    await expectTooltipOnHover(
      within(screen.getByRole("option", { name: "APC PDU" })).getByText(
        "APC PDU"
      ).parentElement,
      "Disabled due to network vulnerability"
    );
  });

  it("shows all power types without FIPS reasons when FIPS is not active", async () => {
    const noFipsRestrictionsResponse = {
      items: [
        factory.powerTypeV3({
          name: "manual",
          description: "Manual",
          fips_supported: true,
          fips_unsupported_reason: undefined,
        }),
        factory.powerTypeV3({
          name: "amt",
          description: "Intel AMT",
          fips_supported: false,
          fips_unsupported_reason: "uses non-approved cryptography",
        }),
      ],
    };

    mockServer.use(
      powerTypesResolvers.listPowerTypes.handler(noFipsRestrictionsResponse),
      systemResolvers.getSystemInfo.handler(
        factory.systemInfo({ fips_active: false })
      )
    );

    const powerTypes = [
      factory.powerType({
        name: "manual",
        description: "Manual",
      }),
      factory.powerType({
        name: "amt",
        description: "Intel AMT",
      }),
    ];
    state.general.powerTypes.data = powerTypes;

    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: {},
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

    await userEvent.click(screen.getByRole("button", { name: "Power type" }));

    expect(screen.getByRole("option", { name: "Manual" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Intel AMT" })
    ).toBeInTheDocument();

    // No FIPS reason tooltip should be shown for any option
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it.each([
    PowerTypeNames.WEBHOOK,
    PowerTypeNames.PROXMOX,
    PowerTypeNames.HMCZ,
  ])(
    "forces SSL verification on and disables the field for %s when FIPS is active",
    async (powerTypeName) => {
      mockServer.use(
        systemResolvers.getSystemInfo.handler(
          factory.systemInfo({ fips_active: true })
        )
      );
      const powerTypes = [
        factory.powerType({
          fields: [
            factory.powerField({
              choices: [
                ["n", "No"],
                ["y", "Yes"],
              ],
              default: "n",
              field_type: PowerFieldType.CHOICE,
              label: "Verify SSL",
              name: POWER_VERIFY_SSL_FIELD_NAME,
            }),
          ],
          name: powerTypeName,
        }),
      ];
      state.general.powerTypes.data = powerTypes;
      renderWithMockStore(
        <Formik
          initialValues={{
            power_parameters: { [POWER_VERIFY_SSL_FIELD_NAME]: "n" },
            power_type: powerTypeName,
          }}
          onSubmit={vi.fn()}
        >
          <PowerTypeFields />
        </Formik>,
        { state }
      );

      await waitForLoading();

      const verifySslField = screen.getByRole("combobox", {
        name: "Verify SSL",
      });
      await waitFor(() => {
        expect(verifySslField).toHaveValue("y");
      });
      expect(verifySslField).toBeDisabled();
    }
  );

  it("does not force SSL verification for power types that don't require it", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({
            choices: [
              ["n", "No"],
              ["y", "Yes"],
            ],
            default: "n",
            field_type: PowerFieldType.CHOICE,
            label: "Verify SSL",
            name: POWER_VERIFY_SSL_FIELD_NAME,
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: { [POWER_VERIFY_SSL_FIELD_NAME]: "n" },
          power_type: PowerTypeNames.MANUAL,
        }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

    const verifySslField = screen.getByRole("combobox", {
      name: "Verify SSL",
    });
    expect(verifySslField).toHaveValue("n");
    expect(verifySslField).not.toBeDisabled();
  });

  it("does not force SSL verification when FIPS is not active", async () => {
    const powerTypes = [
      factory.powerType({
        fields: [
          factory.powerField({
            choices: [
              ["n", "No"],
              ["y", "Yes"],
            ],
            default: "n",
            field_type: PowerFieldType.CHOICE,
            label: "Verify SSL",
            name: POWER_VERIFY_SSL_FIELD_NAME,
          }),
        ],
        name: PowerTypeNames.WEBHOOK,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    renderWithMockStore(
      <Formik
        initialValues={{
          power_parameters: { [POWER_VERIFY_SSL_FIELD_NAME]: "n" },
          power_type: PowerTypeNames.WEBHOOK,
        }}
        onSubmit={vi.fn()}
      >
        <PowerTypeFields />
      </Formik>,
      { state }
    );

    await waitForLoading();

    const verifySslField = screen.getByRole("combobox", {
      name: "Verify SSL",
    });
    expect(verifySslField).toHaveValue("n");
    expect(verifySslField).not.toBeDisabled();
  });
});
