import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";
import type { RootState } from "app/store/root/types";

import { App } from "./App";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  navigationOptions as navigationOptionsFactory,
  navigationOptionsState as navigationOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { status as statusActions } from "app/base/actions";

const mockStore = configureStore();

describe("App", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "completed_intro", value: true }],
      }),
      general: generalStateFactory({
        navigationOptions: navigationOptionsStateFactory({
          data: navigationOptionsFactory,
        }),
      }),
    });
  });

  it("renders routes if logged in", () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Routes").exists()).toBe(true);
  });

  it("displays connection errors", () => {
    state.status.error = "Error!";
    state.status.authenticated = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Section").prop("header")).toBe("Failed to connect.");
  });

  it("displays a loading message if connecting", () => {
    state.status.connecting = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a loading message when authenticating", () => {
    state.status.authenticating = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a loading message if fetching auth user", () => {
    state.user.auth.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("connects to the WebSocket", () => {
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "WEBSOCKET_CONNECT")
    ).toBe(true);
  });

  it("fetches the auth user when connected", () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "FETCH_AUTH_USER")
    ).toBe(true);
  });

  it("shows a login screen when logged out", () => {
    state.status.authenticated = false;
    state.status.connected = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Login").exists()).toBe(true);
  });

  it("can show the RSD link", () => {
    state.general.navigationOptions.data.rsd = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Header").prop("showRSD")).toBe(true);
  });

  it("can hide the RSD link", () => {
    state.general.navigationOptions.data.rsd = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Header").prop("showRSD")).toBe(false);
  });

  it("fetches the auth details again when logging out", () => {
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .filter((action) => action.type === "CHECK_AUTHENTICATED").length
    ).toBe(1);
    state.status.authenticated = false;
    act(() => {
      store.dispatch(statusActions.logout());
    });
    expect(
      store
        .getActions()
        .filter((action) => action.type === "CHECK_AUTHENTICATED").length
    ).toBe(2);
  });
});
