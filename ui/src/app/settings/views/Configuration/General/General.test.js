import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import General from "./General";

const mockStore = configureStore();

describe("General", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "maas_name",
            value: "bionic",
          },
          {
            name: "enable_analytics",
            value: true,
          },
        ],
      },
    };
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <General />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays the General form if config is loaded", () => {
    const state = { ...initialState };
    state.config.loaded = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <General />
      </Provider>
    );

    expect(wrapper.find("GeneralForm").exists()).toBe(true);
  });

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <General />
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
