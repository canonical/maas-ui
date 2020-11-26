import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkDiscoveryForm from "./NetworkDiscoveryForm";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkDiscoveryForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
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
              [600, "Every 10 minutes"],
            ],
          },
          {
            name: "network_discovery",
            value: "enabled",
            choices: [
              ["enabled", "Enabled"],
              ["disabled", "Disabled"],
            ],
          },
        ],
      }),
    });
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

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("dispatches an action to update config on save button click", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkDiscoveryForm />
      </Provider>
    );
    wrapper.find("Formik").props().onSubmit(
      {
        active_discovery_interval: "0",
        network_discovery: "enabled",
      },
      { resetForm: jest.fn() }
    );
    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_CONFIG",
        payload: {
          params: [
            {
              name: "active_discovery_interval",
              value: "0",
            },
            {
              name: "network_discovery",
              value: "enabled",
            },
          ],
        },
        meta: {
          model: "config",
          method: "update",
        },
      },
    ]);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <NetworkDiscoveryForm />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.startsWith("FETCH"));

    expect(fetchActions).toEqual([
      {
        type: "FETCH_CONFIG",
        meta: {
          model: "config",
          method: "list",
        },
      },
    ]);
  });
});
