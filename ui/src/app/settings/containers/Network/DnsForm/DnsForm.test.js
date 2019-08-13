import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DnsForm from "./DnsForm";

const mockStore = configureStore();

describe("DnsForm", () => {
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
        <DnsForm />
      </Provider>
    );

    expect(wrapper.find("Loader").exists()).toBe(true);
  });
});
