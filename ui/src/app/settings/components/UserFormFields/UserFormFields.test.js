import { shallow } from "enzyme";
import React from "react";

import { UserFormFields } from "./UserFormFields";

describe("UserFormFields", () => {
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
    const wrapper = shallow(<UserFormFields formikProps={formikProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("hides the password fields when editing", () => {
    const wrapper = shallow(
      <UserFormFields formikProps={formikProps} editing={true} />
    );
    expect(
      wrapper
        .find("Link")
        .first()
        .children()
        .text()
    ).toEqual("Change password…");
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
  });

  it("can toggle the password fields", () => {
    const wrapper = shallow(
      <UserFormFields formikProps={formikProps} editing={true} />
    );
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(0);
    wrapper.find("Link").simulate("click", { preventDefault: jest.fn() });
    expect(
      wrapper.findWhere(
        n => n.name() === "FormikField" && n.prop("type") === "password"
      ).length
    ).toEqual(2);
  });

  it("disables the submit button when submitting", () => {
    formikProps.isSubmitting = true;
    const wrapper = shallow(<UserFormFields formikProps={formikProps} />);
    expect(
      wrapper
        .find("Button")
        .at(1)
        .prop("disabled")
    ).toBe(true);
  });
});
