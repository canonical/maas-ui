import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DnsFormFields from "./DnsFormFields";

const mockStore = configureStore();

describe("DnsFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    dnssec_validation: "auto",
    dns_trusted_acl: "",
    upstream_dns: ""
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
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "dnssec_validation",
            value: "auto",
            choices: [
              ["auto", "Automatic (use default root key)"],
              ["yes", "Yes (manually configured root key)"],
              [
                "no",
                "No (Disable DNSSEC; useful when upstream DNS is misconfigured)"
              ]
            ]
          },
          { name: "dns_trusted_acl", value: "" },
          { name: "upstream_dns", value: "" }
        ]
      }
    };
  });

  it("correctly reflects dnssec_validation state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.dnssec_validation = "yes";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DnsFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find("select[name='dnssec_validation']").props().value).toBe(
      "yes"
    );
  });

  it("correctly reflects dns_trusted_acl state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.dns_trusted_acl = "trusted acl";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DnsFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find("Input[name='dns_trusted_acl']").props().value).toBe(
      "trusted acl"
    );
  });

  it("correctly reflects upstream_dns state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.upstream_dns = "192.168.1.1";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <DnsFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find("Input[name='upstream_dns']").props().value).toBe(
      "192.168.1.1"
    );
  });
});
