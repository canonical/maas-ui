import { mount } from "enzyme";
import React from "react";

import NtpFormFields from "./NtpFormFields";

describe("NtpFormFields", () => {
  let baseFormikProps;
  let baseValues = {
    ntp_external_only: false,
    ntp_servers: ""
  };

  beforeEach(() => {
    baseFormikProps = {
      errors: {},
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      initialValues: { ...baseValues },
      touched: {},
      values: { ...baseValues }
    };
  });

  it("correctly reflects ntp_external_only state", () => {
    const formikProps = { ...baseFormikProps };
    formikProps.values.ntp_external_only = true;
    const wrapper = mount(<NtpFormFields formikProps={formikProps} />);

    expect(wrapper.find("Input[name='ntp_external_only']").props().value).toBe(
      true
    );
  });

  it("correctly reflects ntp_servers state", () => {
    const formikProps = { ...baseFormikProps };
    formikProps.values.ntp_servers = "ntp.ubuntu.com";
    const wrapper = mount(<NtpFormFields formikProps={formikProps} />);

    expect(wrapper.find("Input[name='ntp_servers']").props().value).toBe(
      "ntp.ubuntu.com"
    );
  });
});
