import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { screen } from "@testing-library/react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { App } from "./App";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

jest.mock("@canonical/react-components/dist/hooks", () => ({
  ...jest.requireActual("@canonical/react-components/dist/hooks"),
  usePrevious: jest.fn(),
}));

describe("App", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
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
          <CompatRouter>
            <App />
          </CompatRouter>
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
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SectionHeader").prop("title")).toBe(
      "Failed to connect"
    );
  });

  it("displays an error if vault is unreachable (sealed)", () => {
    state.config.errors = "Error!!!!";
    state.status.authenticated = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<App />, { route: "/settings", store });
    expect(screen.getByText("Failed to connect")).toBeInTheDocument();
    expect(
      screen.getByText(/The server connection failed./)
    ).toBeInTheDocument();
  });

  it("displays a loading message if connecting", () => {
    state.status.connecting = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <CompatRouter>
            <App />
          </CompatRouter>
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
          <CompatRouter>
            <App />
          </CompatRouter>
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
          <CompatRouter>
            <App />
          </CompatRouter>
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
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store
        .getActions()
        .some((action) => action.type === "status/websocketConnect")
    ).toBe(true);
  });

  it("fetches the auth user when connected", () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      store.getActions().some((action) => action.type === "auth/fetch")
    ).toBe(true);
  });

  it("shows a login screen when logged out", () => {
    state.status.authenticated = false;
    state.status.connected = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Login").exists()).toBe(true);
  });

  it("fetches auth details on mount", () => {
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      store
        .getActions()
        .filter(
          (action) => action.type === statusActions.checkAuthenticated().type
        ).length
    ).toBe(1);
  });

  it("fetches the auth details again when logging out", () => {
    // Mock the user being previously authenticated, and currently unauthenticated
    // i.e. they've logged out.
    jest.spyOn(reactComponentHooks, "usePrevious").mockReturnValue(true);
    state.status.authenticated = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/settings" }]}>
          <CompatRouter>
            <App />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      store
        .getActions()
        .filter(
          (action) => action.type === statusActions.checkAuthenticated().type
        ).length
    ).toBe(2);
  });
});
