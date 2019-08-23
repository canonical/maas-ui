import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MESSAGE_TYPES from "app/base/constants";
import NetworkDiscoveryForm from "./NetworkDiscoveryForm";

const mockStore = configureStore();

describe("NetworkDiscoveryForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "active_discovery_interval",
            value: "0",
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

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <NetworkDiscoveryForm />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", done => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkDiscoveryForm />
      </Provider>
    );
    wrapper.find("form").simulate("submit");

    // since Formik handler is evaluated asynchronously we have to delay checking the assertion
    window.setTimeout(() => {
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_CONFIG",
          payload: {
            params: [
              {
                name: "active_discovery_interval",
                value: "0"
              },
              {
                name: "network_discovery",
                value: "enabled"
              }
            ]
          },
          meta: {
            model: "config",
            method: "update",
            type: MESSAGE_TYPES.REQUEST
          }
        }
      ]);
      done();
    }, 0);
  });
});
