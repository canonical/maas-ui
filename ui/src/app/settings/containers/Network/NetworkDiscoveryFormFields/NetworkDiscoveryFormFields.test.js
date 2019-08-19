import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkDiscoveryFormFields from "./NetworkDiscoveryFormFields";

const mockStore = configureStore();

describe("NetworkDiscoveryFormFields", () => {
  let baseFormikProps;
  let initialState;
  let baseValues = {
    active_discovery_interval: "0",
    network_discovery: "disabled"
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
            name: "active_discovery_interval",
            value: 0,
            choices: [
              [0, "Never (disabled)"],
              [604800, "Every week"],
              [86400, "Every day"],
              [43200, "Every 12 hours"],
              [21600, "Every 6 hours"],
              [10800, "Every 3 hours"],
              [3600, "Every hour"],
              [1800, "Every 30 minutes"],
              [600, "Every 10 minutes"]
            ]
          },
          {
            name: "network_discovery",
            value: "enabled",
            choices: [["enabled", "Enabled"], ["disabled", "Disabled"]]
          }
        ]
      }
    };
  });

  it("correctly reflects active_discovery_interval state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.active_discovery_interval = "600";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <NetworkDiscoveryFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(
      wrapper.find("select[name='active_discovery_interval']").props().value
    ).toBe("600");
  });

  it("correctly reflects network_discovery state", () => {
    const state = { ...initialState };
    const formikProps = { ...baseFormikProps };
    formikProps.values.network_discovery = "enabled";
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <NetworkDiscoveryFormFields formikProps={formikProps} />
      </Provider>
    );

    expect(wrapper.find("select[name='network_discovery']").props().value).toBe(
      "enabled"
    );
  });
});
