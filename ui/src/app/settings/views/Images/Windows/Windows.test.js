import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Windows from "./Windows";

const mockStore = configureStore();

describe("Windows", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: []
      },
      general: {}
    };
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Windows />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });

  it("displays the Windows form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Windows />
      </Provider>
    );

    expect(wrapper.find("WindowsForm").exists()).toBe(true);
  });
});
