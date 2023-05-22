import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import configureStore from "redux-mock-store";

import { App } from "./App";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import { actions as statusActions } from "app/store/status";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

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
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(window.location.pathname).toBe("/settings");
    expect(
      screen.getByRole("heading", { name: "Settings" })
    ).toBeInTheDocument();
  });

  it("displays connection errors", () => {
    state.status.error = "Uh oh spaghettio";
    state.status.authenticated = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(
      screen.getByText(
        /The server connection failed with the error "Uh oh spaghettio"/i
      )
    ).toBeInTheDocument();
  });

  it("displays an error if vault is sealed", () => {
    state.config.errors = "Vault request failed";
    state.status.authenticated = true;
    state.status.error = null;
    state.status.connected = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Failed to connect")).toBeInTheDocument();
    expect(
      screen.getByText(
        /The server connection failed with the error "Vault request failed"/
      )
    ).toBeInTheDocument();
  });

  it("displays an error if vault is unreachable", () => {
    state.config.errors = "Vault connection failed";
    state.status.authenticated = true;
    state.status.error = null;
    state.status.connected = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Failed to connect")).toBeInTheDocument();
    expect(
      screen.getByText(
        /The server connection failed with the error "Vault connection failed"/
      )
    ).toBeInTheDocument();
  });

  it("displays a loading message if connecting", () => {
    state.status.connecting = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a loading message when authenticating", () => {
    state.status.authenticating = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a loading message if fetching auth user", () => {
    state.user.auth.loading = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("connects to the WebSocket", () => {
    state.status.authenticated = true;
    const store = mockStore(state);
    renderWithBrowserRouter(<App />, { route: "/settings", store });
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
    renderWithBrowserRouter(<App />, { route: "/settings", store });
    expect(
      store.getActions().some((action) => action.type === "auth/fetch")
    ).toBe(true);
  });

  it("shows a login screen when logged out", () => {
    state.status.authenticated = false;
    state.status.connected = true;
    renderWithBrowserRouter(<App />, { route: "/settings", state });
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("fetches auth details on mount", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<App />, { route: "/settings", store });

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
    renderWithBrowserRouter(<App />, { route: "/settings", store });

    expect(
      store
        .getActions()
        .filter(
          (action) => action.type === statusActions.checkAuthenticated().type
        ).length
    ).toBe(2);
  });
});
