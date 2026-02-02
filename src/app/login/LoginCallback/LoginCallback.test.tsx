import { authResolvers } from "@/testing/resolvers/auth";
import { renderWithProviders, setupMockServer, screen } from "@/testing/utils";
import LoginCallback, { Labels } from "./LoginCallback";
import * as factory from "@/testing/factories";
import { RootState } from "@/app/store/root/types";
import { waitFor } from "@testing-library/dom";

const mockServer = setupMockServer(
  authResolvers.createSession.handler(),
  authResolvers.getCallback.handler()
);

describe("LoginCallback", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      status: factory.statusState({
        authenticated: false,
      }),
    });
  });

  it("shows an error if the code or state params are missing", async () => {
    renderWithProviders(<LoginCallback />, {
      initialEntries: ["/login/oidc/callback?code=abc123"],
      state,
    });
    expect(screen.getByRole("alert")).toHaveTextContent(Labels.MissingParams);
  });

  it("shows an error if callback fails", async () => {
    mockServer.use(authResolvers.getCallback.error());
    renderWithProviders(<LoginCallback />, {
      initialEntries: ["/login/oidc/callback?code=abc123&state=xyz789"],
      state,
    });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(Labels.CallbackError);
    });
  });

  it("shows a loading state while processing the callback", async () => {
    renderWithProviders(<LoginCallback />, {
      initialEntries: ["/login/oidc/callback?code=abc123&state=xyz789"],
      state,
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to machines page if already authenticated", async () => {
    state.status.authenticated = true;
    const { router } = renderWithProviders(<LoginCallback />, {
      initialEntries: ["/login/oidc/callback?code=abc123&state=xyz789"],
      state,
    });
    await waitFor(() => {
      expect(screen.getByText(Labels.AlreadyAuthenticated)).toBeInTheDocument();
      expect(router.state.location.pathname).toBe("/machines");
    });
  });
});
