import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { App } from "./App";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import { statusActions } from "@/app/store/status";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { renderWithProviders, screen, setupMockServer } from "@/testing/utils";

const mockStore = configureStore<RootState>();
setupMockServer(authResolvers.getThisUser.handler());

vi.mock("@canonical/react-components/dist/hooks", async () => {
  const actual: object = await vi.importActual(
    "@canonical/react-components/dist/hooks"
  );
  return {
    ...actual,
    usePrevious: vi.fn(),
  };
});

describe("App", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [{ name: ConfigNames.COMPLETED_INTRO, value: true }],
      }),
    });
  });

  it("displays correct status on connection errors", () => {
    state.status.error = "Uh oh spaghettio";
    state.status.authenticated = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    expect(screen.getByText(/Trying to reconnect/i)).toBeInTheDocument();
  });

  it("displays an error if vault is sealed", async () => {
    state.config.errors = "Vault request failed";
    state.status.authenticated = true;
    state.status.error = null;
    state.status.connected = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    await waitFor(() =>
      expect(screen.getByText("Failed to connect")).toBeInTheDocument()
    );
    expect(
      screen.getByText(
        /The server connection failed with the error "Vault request failed"/
      )
    ).toBeInTheDocument();
  });

  it("displays an error if vault is unreachable", async () => {
    state.config.errors = "Vault connection failed";
    state.status.authenticated = true;
    state.status.error = null;
    state.status.connected = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    await waitFor(() =>
      expect(screen.getByText("Failed to connect")).toBeInTheDocument()
    );
    expect(
      screen.getByText(
        /The server connection failed with the error "Vault connection failed"/
      )
    ).toBeInTheDocument();
  });

  it("displays a loading message if connecting for the first time", () => {
    state.status.connected = false;
    state.status.connecting = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not display a loading message if reconnecting", async () => {
    state.status.connected = true;
    state.status.connecting = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
  });

  it("displays a loading message when authenticating", () => {
    state.status.authenticating = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a loading message if fetching auth user", () => {
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("connects to the WebSocket", () => {
    state.status.authenticated = true;
    const store = mockStore(state);
    renderWithProviders(<App />, { initialEntries: ["/settings"], store });
    expect(
      store
        .getActions()
        .some((action) => action.type === "status/websocketConnect")
    ).toBe(true);
  });

  it("fetches the auth user when connected", async () => {
    state.status.connected = true;
    state.status.authenticated = true;
    const store = mockStore(state);
    renderWithProviders(<App />, { initialEntries: ["/settings"], store });
    await waitFor(() => expect(authResolvers.getThisUser.resolved).toBe(true));
  });

  it("shows a login screen when logged out", async () => {
    state.status.authenticated = false;
    state.status.connected = true;
    renderWithProviders(<App />, { initialEntries: ["/settings"], state });
    await waitFor(() => expect(screen.getByText("Login")).toBeInTheDocument());
  });

  it("fetches auth details on mount", () => {
    const store = mockStore(state);
    renderWithProviders(<App />, { initialEntries: ["/settings"], store });

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
    vi.spyOn(reactComponentHooks, "usePrevious").mockReturnValue(true);
    state.status.authenticated = false;
    const store = mockStore(state);
    renderWithProviders(<App />, { initialEntries: ["/settings"], store });

    expect(
      store
        .getActions()
        .filter(
          (action) => action.type === statusActions.checkAuthenticated().type
        ).length
    ).toBe(2);
  });
});
