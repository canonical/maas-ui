import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Deploy from "./Deploy";

const mockStore = configureStore();

describe("Deploy", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {},
      general: {}
    };
  });

  it("loads", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <Deploy />
      </Provider>
    );
    expect(wrapper.exists()).toBe(true);
  });

  it("dispatches action to fetch general on load", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <Deploy />
      </Provider>
    );

    const fetchGeneralOsinfoAction = store
      .getActions()
      .find(action => action.type === "FETCH_GENERAL_OSINFO");

    expect(fetchGeneralOsinfoAction).toEqual({
      type: "FETCH_GENERAL_OSINFO",
      meta: {
        model: "general",
        method: "osinfo"
      }
    });
  });
});
