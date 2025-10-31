import ResetSingleSignOn from "./ResetSingleSignOn";

import { authResolvers, mockOauthProvider } from "@/testing/resolvers/auth";
import {
  mockIsPending,
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.updateOauthProvider.handler(),
  authResolvers.deleteOauthProvider.handler(),
  authResolvers.getActiveOauthProvider.handler()
);

const { mockClose } = await mockSidePanel();

describe("ResetSingleSignOn", () => {
  beforeEach(() => {
    authResolvers.updateOauthProvider.resolved = false;
    authResolvers.deleteOauthProvider.resolved = false;
    authResolvers.getActiveOauthProvider.resolved = false;
  });

  it("displays a spinner while loading", () => {
    mockIsPending();

    renderWithProviders(<ResetSingleSignOn id={mockOauthProvider.id} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows errors encountered while fetching the provider", async () => {
    mockServer.use(
      authResolvers.getActiveOauthProvider.error({
        message: "Uh oh!",
        code: 500,
        kind: "Error",
      })
    );

    renderWithProviders(<ResetSingleSignOn id={mockOauthProvider.id} />);

    await waitFor(() => {
      expect(
        screen.getByText("Error while fetching OIDC provider")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Uh oh!")).toBeInTheDocument();
  });

  it("closes the form when 'Cancel' is clicked", async () => {
    renderWithProviders(<ResetSingleSignOn id={mockOauthProvider.id} />);

    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Reset single sign-on configuration" })
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockClose).toHaveBeenCalled();
  });

  it("updates and deletes the provider, and closes the form when submitted", async () => {
    renderWithProviders(<ResetSingleSignOn id={mockOauthProvider.id} />);

    await waitFor(() => {
      expect(
        screen.getByRole("form", { name: "Reset single sign-on configuration" })
      ).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Reset single sign-on configuration" })
    );

    expect(authResolvers.updateOauthProvider.resolved).toBe(true);
    expect(authResolvers.deleteOauthProvider.resolved).toBe(true);

    expect(mockClose).toHaveBeenCalled();
  });
});
