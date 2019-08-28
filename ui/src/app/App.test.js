import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { App } from "./App";

const mockStore = configureStore();

describe("App", () => {
  let state;

  beforeEach(() => {
    state = {
      messages: {
        items: []
      },
      status: {
        connected: true
      },
      user: {
        auth: {
          loading: false,
          user: {}
        }
      }
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("App").exists()).toBe(true);
  });

  it("displays connection errors", () => {
    state.status.error = "Error!";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe(
      "Failed to connect. Please try refreshing your browser."
    );
  });

  it("displays a loading message", () => {
    state.status.connected = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("title")).toBe("Loading…");
  });

  it("connects to the WebSocket", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some(action => action.type === "WEBSOCKET_CONNECT")
    ).toBe(true);
  });
});
