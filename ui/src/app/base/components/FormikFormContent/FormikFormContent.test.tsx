import { mount } from "enzyme";
import { Formik } from "formik";

import FormikFormContent from "./FormikFormContent";

describe("FormikFormContent", () => {
  it("can render", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent initialValues={{}}>Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("FormikFormContent").exists()).toBe(true);
  });

  it("can display non-field errors from a string", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent initialValues={{}} errors="Uh oh!">
          Content
        </FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can display non-field errors from the __all__ key", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent initialValues={{}} errors={{ __all__: ["Uh oh!"] }}>
          Content
        </FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can be inline", () => {
    const wrapper = mount(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent initialValues={{}} inline>
          Content
        </FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Form").prop("inline")).toBe(true);
  });

  it("does not render buttons if editable is set to false", () => {
    const wrapper = mount(
      <Formik initialValues={{}}>
        <FormikFormContent editable={false}>Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("button").exists()).toBe(false);
  });
});
