import { mount } from "enzyme";
import { Formik } from "formik";
import { Textarea } from "@canonical/react-components";
import React from "react";

import FormikField from "./FormikField";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

describe("FormikField", () => {
  it("can render", () => {
    const wrapper = mount(
      <Formik>
        <FormikField
          name="username"
          help="Required."
          id="username"
          label="Username"
          required={true}
          type="text"
        />
      </Formik>
    );
    expect(wrapper.find("FormikField")).toMatchSnapshot();
  });

  it("can set a different component", () => {
    const wrapper = mount(
      <Formik>
        <FormikField component={Textarea} name="username" />
      </Formik>
    );
    expect(wrapper.find("Textarea").exists()).toBe(true);
  });
});
