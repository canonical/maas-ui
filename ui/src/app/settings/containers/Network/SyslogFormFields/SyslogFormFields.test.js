import { mount } from "enzyme";
import React from "react";

import SyslogFormFields from "./SyslogFormFields";

describe("SyslogFormFields", () => {
  let baseFormikProps;
  let baseValues = {
    remote_syslog: ""
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
    formikProps.values.remote_syslog = "remote syslog";
    const wrapper = mount(<SyslogFormFields formikProps={formikProps} />);

    expect(wrapper.find("Input[name='remote_syslog']").props().value).toBe(
      "remote syslog"
    );
  });
});
