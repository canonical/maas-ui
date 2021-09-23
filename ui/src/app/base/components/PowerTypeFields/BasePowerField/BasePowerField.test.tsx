import { mount } from "enzyme";
import { Formik } from "formik";

import BasePowerField from "./BasePowerField";

import { PowerFieldType } from "app/store/general/types";
import { powerField as powerFieldFactory } from "testing/factories";

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
});
