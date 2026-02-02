import { waitFor } from "@testing-library/react";

import NetworkDiscoveryConfigurationForm from "@/app/settings/views/Network/NetworkDiscoveryConfigurationForm/NetworkDiscoveryConfigurationForm";
import { authResolvers, mockAuth } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

const mockServer = setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler({ ...mockAuth, is_superuser: true })
);

describe("NetworkDiscoveryConfigurationForm", () => {
  it("renders permission message if user is not superuser", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler({ ...mockAuth, is_superuser: false })
    );
    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByText("You do not have permission to view this page.")
      ).toBeInTheDocument();
    });
  });

  it("shows disabled discovery warning", async () => {
    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByText(
          "List of devices will not update as discovery is turned off."
        )
      ).toBeInTheDocument();
    });
  });
});
