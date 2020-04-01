import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import { Formik } from "formik";
import React from "react";

import PowerTypeFields from "../PowerTypeFields";

describe("PowerTypeFields", () => {
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
});
