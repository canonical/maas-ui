import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import { reduceInitialState } from "testing/utils";
import ProxyForm from "./ProxyForm";

const mockStore = configureStore();

describe("ProxyForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        loading: false,
        loaded: true,
        items: [
          {
            name: "http_proxy",
            value: "http://www.url.com"
          },
          {
            name: "enable_http_proxy",
            value: false
          },
          {
            name: "use_peer_proxy",
            value: false
          }
        ]
      }
    };
  });

  it("displays a text input if http proxy is enabled", () => {
    const state = { ...initialState };
    state.config.items = reduceInitialState(
      state.config.items,
      "name",
      "enable_http_proxy",
      { value: true }
    );
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/network", key: "testKey" }]}
        >
          <ProxyForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[type='text']").exists()).toBe(true);
  });
});
