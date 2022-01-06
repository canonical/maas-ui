import { mount } from "enzyme";
import { Formik } from "formik";

import BasePowerField from "./BasePowerField";

import { PowerFieldType } from "app/store/general/types";
import { powerField as powerFieldFactory } from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

describe("BasePowerField", () => {
  it("can be disabled", () => {
    const field = powerFieldFactory();
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField disabled field={field} />
      </Formik>
    );
    expect(wrapper.find("input").prop("disabled")).toBe(true);
  });

  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field-name" });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField
          field={field}
          powerParametersValueName="custom-power-parameters"
        />
      </Formik>
    );
    expect(wrapper.find("input").prop("name")).toBe(
      "custom-power-parameters.field-name"
    );
  });

  it("correctly renders a string field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.STRING });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(wrapper.find("input[type='text']").exists()).toBe(true);
    expect(wrapper.find("input[type='password']").exists()).toBe(false);
    expect(wrapper.find("select").exists()).toBe(false);
  });

  it("correctly renders a password field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.PASSWORD });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(wrapper.find("input[type='text']").exists()).toBe(false);
    expect(wrapper.find("input[type='password']").exists()).toBe(true);
    expect(wrapper.find("select").exists()).toBe(false);
  });

  it("correctly renders a choice field type", () => {
    const field = powerFieldFactory({ field_type: PowerFieldType.CHOICE });
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BasePowerField field={field} />
      </Formik>
    );
    expect(wrapper.find("input[type='text']").exists()).toBe(false);
    expect(wrapper.find("input[type='password']").exists()).toBe(false);
    expect(wrapper.find("select").exists()).toBe(true);
  });

  it("correctly handles a multiple choice field type", async () => {
    const field = powerFieldFactory({
      choices: [
        ["value1", "label1"],
        ["value2", "label2"],
      ],
      field_type: PowerFieldType.MULTIPLE_CHOICE,
      label: "label",
      name: "field",
    });
    const wrapper = mount(
      <Formik
        initialValues={{ power_parameters: { field: ["value1"] } }}
        onSubmit={jest.fn()}
      >
        <BasePowerField field={field} />
      </Formik>
    );
    const findCheckbox = (i: number) =>
      wrapper.find("input[data-testid='multi-choice-checkbox']").at(i);

    expect(wrapper.find("[data-testid='field-label']").text()).toBe("label");
    expect(findCheckbox(0).prop("checked")).toBe(true);
    expect(findCheckbox(1).prop("checked")).toBe(false);

    findCheckbox(0).simulate("change");
    findCheckbox(1).simulate("change");
    await waitForComponentToPaint(wrapper);

    expect(findCheckbox(0).prop("checked")).toBe(false);
    expect(findCheckbox(1).prop("checked")).toBe(true);
  });
});
