import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";

import ProxyForm from "./ProxyForm";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { reduceInitialState } from "testing/utils";

const mockStore = configureStore();

describe("ProxyForm", () => {
  let initialState;

  beforeEach(() => {
    initialState = rootStateFactory({
      config: configStateFactory({
        loaded: true,
        items: [
          {
            name: "http_proxy",
            value: "http://www.url.com",
          },
          {
            name: "enable_http_proxy",
            value: false,
          },
          {
            name: "use_peer_proxy",
            value: false,
          },
        ],
      }),
    });
  });

  it("displays a spinner if config is loading", () => {
    const state = { ...initialState };
    state.config.loading = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ProxyForm />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
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

  it("dispatches action to fetch config if not already loaded", () => {
    const state = { ...initialState };
    state.config.loaded = false;
    const store = mockStore(state);

    mount(
      <Provider store={store}>
        <ProxyForm />
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
