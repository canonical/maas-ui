import { mount } from "enzyme";
import { Formik } from "formik";
import React from "react";

import FormikFormContent from "./FormikFormContent";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

describe("FormikFormContent", () => {
  it("can render", () => {
    const wrapper = mount(
      <Formik>
        <FormikFormContent>Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("FormikFormContent").exists()).toBe(true);
  });

  it("can display non-field errors from a string", () => {
    const wrapper = mount(
      <Formik>
        <FormikFormContent errors="Uh oh!">Content</FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can display non-field errors from the __all__ key", () => {
    const wrapper = mount(
      <Formik>
        <FormikFormContent errors={{ __all__: ["Uh oh!"] }}>
          Content
        </FormikFormContent>
      </Formik>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });
});
