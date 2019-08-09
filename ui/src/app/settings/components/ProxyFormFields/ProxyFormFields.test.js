import { shallow } from "enzyme";
import React from "react";

import ProxyFormFields from "./ProxyFormFields";

describe("ProxyFormFields", () => {
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
    const wrapper = shallow(<ProxyFormFields formikProps={formikProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("disables the submit button when submitting", () => {
    formikProps.isSubmitting = true;
    const wrapper = shallow(<ProxyFormFields formikProps={formikProps} />);
    expect(
      wrapper
        .find("Button")
        .at(0)
        .prop("disabled")
    ).toBe(true);
  });
});
