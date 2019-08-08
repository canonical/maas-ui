import { shallow } from "enzyme";
import React from "react";

import FormikField from "./FormikField";
import Textarea from "app/base/components/Textarea";

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
});
