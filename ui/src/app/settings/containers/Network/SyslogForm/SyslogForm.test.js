import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SyslogForm from "./SyslogForm";

const mockStore = configureStore();

describe("SyslogForm", () => {
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

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <SyslogForm />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });
});
