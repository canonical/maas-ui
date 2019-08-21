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
            choices: []
          },
          {
            name: "default_min_hwe_kernel",
            value: "ga-16.04-lowlatency",
            choices: []
          }
        ]
      },
      general: {
        loading: false,
        loaded: true,
        osInfo: {}
      }
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

    expect(wrapper.find("Loader").exists()).toBe(true);
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
});
