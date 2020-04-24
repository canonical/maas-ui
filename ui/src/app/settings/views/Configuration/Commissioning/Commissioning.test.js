import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Commissioning from "./Commissioning";

const mockStore = configureStore();

describe("Commissioning", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "commissioning_distro_series",
            value: "bionic",
            choices: [],
          },
          {
            name: "default_min_hwe_kernel",
            value: "ga-16.04-lowlatency",
            choices: [],
          },
        ],
      },
      general: {
        osInfo: {
          loading: false,
          loaded: true,
          data: {},
        },
      },
    };
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Commissioning />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the Commissioning form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Commissioning />
      </Provider>
    );

    expect(wrapper.find("CommissioningForm").exists()).toBe(true);
  });

  it(`dispatches actions to fetch config and general os info if either has not
    already loaded`, () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <Commissioning />
      </Provider>
    );

    const fetchActions = store
      .getActions()
      .filter((action) => action.type.startsWith("FETCH"));

    expect(fetchActions).toEqual([
      { type: "FETCH_CONFIG", meta: { model: "config", method: "list" } },
      {
        type: "FETCH_GENERAL_OSINFO",
        meta: {
          model: "general",
          method: "osinfo",
        },
      },
    ]);
  });
});
