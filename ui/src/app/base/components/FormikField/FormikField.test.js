import { shallow } from "enzyme";
import React from "react";

import FormikField from "./FormikField";
import { Textarea } from "@canonical/react-components";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

describe("FormikField", () => {
  let formikProps;

  beforeEach(() => {
    formikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      touched: {},
      values: {}
    };
  });

  it("can render", () => {
    const wrapper = shallow(
      <FormikField
        formikProps={formikProps}
        fieldKey="username"
        help="Required."
        id="username"
        label="Username"
        required={true}
        type="text"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("can set a different component", () => {
    const wrapper = shallow(
      <FormikField
        component={Textarea}
        formikProps={formikProps}
        fieldKey="username"
      />
    );
    expect(wrapper.type()).toEqual(Textarea);
  });

  it("can pass formik errors", () => {
    formikProps.touched.username = true;
    formikProps.errors.username = "Username already exists";
    const wrapper = shallow(
      <FormikField
        component={Textarea}
        formikProps={formikProps}
        fieldKey="username"
      />
    );
    expect(wrapper.prop("error")).toEqual("Username already exists");
  });

  it("can pass errors from status", () => {
    formikProps.touched.username = true;
    formikProps.status = {
      invalidValues: {
        username: "admin"
      },
      serverErrors: {
        username: "Username already exists"
      }
    };
    const wrapper = shallow(
      <FormikField
        component={Textarea}
        formikProps={formikProps}
        fieldKey="username"
        value="admin"
      />
    );
    expect(wrapper.prop("error")).toEqual("Username already exists");
  });

  it("does not show server errors if the value has changed", () => {
    formikProps.touched.username = true;
    formikProps.status = {
      invalidValues: {
        username: "admin"
      },
      serverErrors: {
        username: "Username already exists"
      }
    };
    const wrapper = shallow(
      <FormikField
        component={Textarea}
        formikProps={formikProps}
        fieldKey="username"
        value="koala"
      />
    );
    expect(wrapper.prop("error")).toBe(undefined);
  });
});
