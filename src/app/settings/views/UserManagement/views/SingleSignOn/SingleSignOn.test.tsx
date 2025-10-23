import SingleSignOn from "./SingleSignOn";

import { authResolvers, mockOauthProvider } from "@/testing/resolvers/auth";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getActiveOauthProvider.handler()
);

describe("Single sign-on", () => {
  it("displays a spinner while loading provider information", async () => {
    mockIsPending();

    renderWithProviders(<SingleSignOn />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays a pre-filled form when provider data loads", async () => {
    renderWithProviders(<SingleSignOn />);

    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Single sign-on form" })
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("textbox", { name: /Name/i })).toHaveValue(
      mockOauthProvider.name
    );
  });

  it("displays an empty form if no provider is found", async () => {
    mockServer.use(
      authResolvers.getActiveOauthProvider.error({
        message: "Not found",
        code: 404,
        kind: "Error",
      })
    );

    renderWithProviders(<SingleSignOn />);

    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Single sign-on form" })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Error/)).not.toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /Name/i })).toHaveValue("");
  });

  it("displays an error message for other kinds of errors", async () => {
    mockServer.use(
      authResolvers.getActiveOauthProvider.error({
        message: "Internal server error",
        code: 500,
        kind: "Error",
      })
    );

    renderWithProviders(<SingleSignOn />);

    await waitFor(() => {
      expect(
        screen.getByText("Error while fetching OIDC provider")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Internal server error")).toBeInTheDocument();
  });
});
