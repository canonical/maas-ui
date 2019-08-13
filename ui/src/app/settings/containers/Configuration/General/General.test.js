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
        items: []
      }
    };
  });

  it("displays the general form when loaded", () => {
    const state = { ...initialState };
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <General />
      </Provider>
    );

    expect(wrapper.find("GeneralForm").exists()).toBe(true);
  });
});
