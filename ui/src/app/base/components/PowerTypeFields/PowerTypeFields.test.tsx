import { mount } from "enzyme";
import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDPowerFields from "./LXDPowerFields";
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

const mockStore = configureStore();

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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ power_type: PowerTypeNames.MANUAL }}
          onSubmit={jest.fn()}
        >
          <PowerTypeFields />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find("Input[name='power_parameters.field1']").props().label
    ).toBe("Required text");
    expect(
      wrapper.find("Input[name='power_parameters.field1']").props().required
    ).toBe(true);
    expect(
      wrapper.find("Input[name='power_parameters.field2']").props().label
    ).toBe("Non-required text");
    expect(
      wrapper.find("Input[name='power_parameters.field2']").props().required
    ).toBe(false);
    expect(
      wrapper.find("Select[name='power_parameters.field3']").props().label
    ).toBe("Select with choices");
    expect(
      wrapper.find("Select[name='power_parameters.field3']").find("option")
        .length
    ).toBe(2);
    expect(
      wrapper
        .find("Select[name='power_parameters.field3']")
        .find("option")
        .at(0)
        .text()
    ).toBe("Choice 1");
    expect(
      wrapper
        .find("Select[name='power_parameters.field3']")
        .find("option")
        .at(1)
        .text()
    ).toBe("Choice 2");
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ power_type: PowerTypeNames.MANUAL }}
          onSubmit={jest.fn()}
        >
          <PowerTypeFields showSelect={false} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Select").exists()).toBe(false);
  });

  it("can limit the fields to show based on their scope", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({
            name: "field1",
            scope: PowerFieldScope.NODE,
          }),
          powerFieldFactory({
            name: "field2",
            scope: PowerFieldScope.BMC,
          }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ power_type: PowerTypeNames.MANUAL }}
          onSubmit={jest.fn()}
        >
          <PowerTypeFields fieldScopes={[PowerFieldScope.NODE]} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Input[name='power_parameters.field1']").exists()).toBe(
      true
    );
    expect(wrapper.find("Input[name='power_parameters.field2']").exists()).toBe(
      false
    );
  });

  it("can only show power types suitable for chassis", () => {
    const powerTypes = [
      powerTypeFactory({
        can_probe: true,
        fields: [],
        name: PowerTypeNames.VIRSH,
      }),
      powerTypeFactory({
        can_probe: false,
        fields: [],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ power_type: "" }} onSubmit={jest.fn()}>
          <PowerTypeFields forChassis />
        </Formik>
      </Provider>
    );

    expect(
      wrapper.find(`option[value='${PowerTypeNames.VIRSH}']`).exists()
    ).toBe(true);
    expect(
      wrapper.find(`option[value='${PowerTypeNames.MANUAL}']`).exists()
    ).toBe(false);
  });

  it("can be given different values for formik field names", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [powerFieldFactory({ name: "parameter1" })],
        name: PowerTypeNames.MANUAL,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
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
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Select[name='powerType']").exists()).toBe(true);
    expect(
      wrapper.find("Input[name='powerParameters.parameter1']").exists()
    ).toBe(true);
  });

  it("can disable the power type select", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            power_parameters: {},
            power_type: PowerTypeNames.MANUAL,
          }}
          onSubmit={jest.fn()}
        >
          <PowerTypeFields disableSelect />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Select[name='power_type']").prop("disabled")).toBe(
      true
    );
  });

  it("resets the fields of the selected power type on change", async () => {
    // Mock two power types that share a power parameter "parameter1"
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ default: "default1", name: "parameter1" }),
          powerFieldFactory({ default: "default2", name: "parameter2" }),
        ],
        name: PowerTypeNames.MANUAL,
      }),
      powerTypeFactory({
        fields: [
          powerFieldFactory({ default: "default3", name: "parameter1" }),
          powerFieldFactory({ default: "default4", name: "parameter3" }),
        ],
        name: PowerTypeNames.VIRSH,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
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
        </Formik>
      </Provider>
    );

    // Change power type to "virsh"
    await act(async () => {
      wrapper.find("select[name='power_type']").simulate("change", {
        target: { name: "power_type", value: PowerTypeNames.VIRSH },
      });
    });
    wrapper.update();

    // Fields of selected power type should be reset to defaults
    expect(
      wrapper.find("input[name='power_parameters.parameter1']").prop("value")
    ).toBe("default3");
    expect(
      wrapper.find("input[name='power_parameters.parameter2']").exists()
    ).toBe(false);
    expect(
      wrapper.find("input[name='power_parameters.parameter3']").prop("value")
    ).toBe("default4");
  });

  it("renders LXD power fields with custom props if selected", () => {
    const powerTypes = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({ name: "certificate" }),
          powerFieldFactory({ name: "key" }),
          powerFieldFactory({ name: "password" }),
        ],
        name: PowerTypeNames.LXD,
      }),
    ];
    state.general.powerTypes.data = powerTypes;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
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
        </Formik>
      </Provider>
    );

    expect(wrapper.find(LXDPowerFields).exists()).toBe(true);
    expect(wrapper.find(LXDPowerFields).prop("initialShouldGenerateCert")).toBe(
      false
    );
  });
});
