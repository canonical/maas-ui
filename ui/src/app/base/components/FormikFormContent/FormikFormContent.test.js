import { mount } from "enzyme";
import { Formik } from "formik";
import React from "react";

import FormikFormContent from "./FormikFormContent";

describe("FormikFormContent", () => {
  it("can render", () => {
    const wrapper = mount(
      <Formik initialValues={{}}>
        <FormikFormContent>Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("FormikFormContent").exists()).toBe(true);
  });

  it("can display non-field errors from a string", () => {
    const wrapper = mount(
      <Formik initialValues={{}}>
        <FormikFormContent errors="Uh oh!">Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can display non-field errors from the __all__ key", () => {
    const wrapper = mount(
      <Formik initialValues={{}}>
        <FormikFormContent errors={{ __all__: ["Uh oh!"] }}>
          Content
        </FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });
});
