import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { Formik } from "formik";
import React from "react";

import PowerTypeFields from "../PowerTypeFields";

describe("PowerTypeFields", () => {
  it("gives fields the correct types", async () => {
    const formikProps = {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    const powerTypes = [
      {
        name: "fake_power_type",
        description: "This is not real",
        fields: [
          {
            name: "field1",
            label: "String",
            field_type: "string",
          },
          {
            name: "field2",
            label: "Password",
            field_type: "password",
          },
          {
            name: "field3",
            label: "Choice",
            field_type: "choice",
            choices: [
              ["choice1", "Choice 1"],
              ["choice2", "Choice 2"],
            ],
          },
        ],
      },
    ];
    const wrapper = mount(
      <Formik>
        <PowerTypeFields
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType="fake_power_type"
        />
      </Formik>
    );

    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .props()
        .onChange({ target: { name: "power_type", value: "fake_power_type" } });
    });
    wrapper.update();

    expect(
      wrapper.find("Input[name='power_parameters.field1']").props().type
    ).toBe("text");
    expect(
      wrapper.find("Input[name='power_parameters.field2']").props().type
    ).toBe("password");
    expect(
      wrapper.find("Select[name='power_parameters.field3']").props().type
    ).toBe(undefined);
  });

  it("correctly generates power options from power type", async () => {
    const formikProps = {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    const powerTypes = [
      {
        name: "fake_power_type",
        description: "This is not real",
        fields: [
          {
            name: "field1",
            label: "Required text",
            required: true,
          },
          {
            name: "field2",
            label: "Non-required text",
            required: false,
          },
          {
            name: "field3",
            label: "Select with choices",
            field_type: "choice",
            choices: [
              ["choice1", "Choice 1"],
              ["choice2", "Choice 2"],
            ],
          },
        ],
      },
    ];
    const wrapper = mount(
      <Formik>
        <PowerTypeFields
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType="fake_power_type"
        />
      </Formik>
    );

    const powerTypesSelect = wrapper.find("select[name='power_type']");
    // Select the fake power type from the dropdown
    await act(async () => {
      powerTypesSelect
        .props()
        .onChange({ target: { name: "power_type", value: "fake_power_type" } });
    });
    wrapper.update();

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

  it("does not show select if showSelect is false", async () => {
    const formikProps = {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    const powerTypes = [
      {
        name: "power_type",
        description: "Power",
        fields: [
          {
            name: "field1",
            label: "Label1",
            scope: "bmc",
          },
          {
            name: "field2",
            label: "Label2",
            scope: "node",
          },
        ],
      },
    ];
    const wrapper = mount(
      <Formik>
        <PowerTypeFields
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType="power_type"
          showSelect={false}
        />
      </Formik>
    );

    expect(wrapper.find("Select").exists()).toBe(false);
  });

  it("does not show node fields if using non-node driver type", async () => {
    const formikProps = {
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    const powerTypes = [
      {
        name: "power_type",
        description: "Power",
        fields: [
          {
            name: "field1",
            label: "Label1",
            scope: "bmc",
          },
          {
            name: "field2",
            label: "Label2",
            scope: "node",
          },
        ],
      },
    ];
    const wrapper = mount(
      <Formik>
        <PowerTypeFields
          driverType="chassis"
          formikProps={formikProps}
          powerTypes={powerTypes}
          selectedPowerType="power_type"
        />
      </Formik>
    );

    // Select the power type from the dropdown
    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .props()
        .onChange({ target: { name: "power_type", value: "power_type" } });
    });
    wrapper.update();

    expect(wrapper.find("Input[name='power_parameters.field1']").exists()).toBe(
      true
    );
    expect(wrapper.find("Input[name='power_parameters.field2']").exists()).toBe(
      false
    );
  });
});
