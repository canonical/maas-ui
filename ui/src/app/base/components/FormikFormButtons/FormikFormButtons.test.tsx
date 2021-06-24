import { mount } from "enzyme";
import { Formik } from "formik";

import FormikFormButtons from "./FormikFormButtons";

describe("FormikFormButtons ", () => {
  it("can display a cancel button", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons onCancel={jest.fn()} submitLabel="Save user" />
      </Formik>
    );
    const button = wrapper.find("Button");
    expect(button.exists()).toBe(true);
    expect(button.children().text()).toBe("Cancel");
  });

  it("can perform a secondary submit action if function and label provided", () => {
    const secondarySubmit = jest.fn();
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons
          submitLabel="Save user"
          secondarySubmit={secondarySubmit}
          secondarySubmitLabel="Save and add another"
        />
      </Formik>
    );
    expect(wrapper.find("[data-test='secondary-submit'] button").text()).toBe(
      "Save and add another"
    );
    wrapper.find("[data-test='secondary-submit'] button").simulate("click");
    expect(secondarySubmit).toHaveBeenCalled();
  });

  it("can generate a secondary submit label via a function", () => {
    const secondarySubmit = jest.fn();
    const wrapper = mount(
      <Formik initialValues={{ name: "Koala" }} onSubmit={jest.fn()}>
        <FormikFormButtons
          submitLabel="Save user"
          secondarySubmit={secondarySubmit}
          secondarySubmitLabel={({ name }) => `Kool ${name}`}
        />
      </Formik>
    );
    expect(wrapper.find("button[data-test='secondary-submit']").text()).toBe(
      "Kool Koala"
    );
    wrapper.find("[data-test='secondary-submit'] button").simulate("click");
    expect(secondarySubmit).toHaveBeenCalled();
  });

  it("can display a tooltip for the secondary submit action", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons
          submitLabel="Save user"
          secondarySubmit={jest.fn()}
          secondarySubmitLabel="Save and add another"
          secondarySubmitTooltip="Will add another"
        />
      </Formik>
    );
    expect(wrapper.find("Tooltip").exists()).toBe(true);
  });

  it("displays a border if bordered is true", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons buttonsBordered submitLabel="Save" />
      </Formik>
    );
    expect(wrapper.find("hr").exists()).toBe(true);
  });

  it("can fire custom onCancel function", () => {
    const onCancel = jest.fn();
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons onCancel={onCancel} submitLabel="Save" />
      </Formik>
    );
    wrapper.find('[data-test="cancel-action"] button').simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });

  it("can display a saving label", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormButtons
          saving
          savingLabel="Be patient!"
          submitLabel="Save"
        />
      </Formik>
    );
    expect(wrapper.find('[data-test="saving-label"]').text()).toBe(
      "Be patient!"
    );
  });
});
