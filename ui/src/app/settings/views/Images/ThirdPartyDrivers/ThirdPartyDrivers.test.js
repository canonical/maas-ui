import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ThirdPartyDrivers from "./ThirdPartyDrivers";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ThirdPartyDrivers", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDrivers />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the ThirdPartyDrivers form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDrivers />
      </Provider>
    );

    expect(wrapper.find("ThirdPartyDriversForm").exists()).toBe(true);
  });
});
