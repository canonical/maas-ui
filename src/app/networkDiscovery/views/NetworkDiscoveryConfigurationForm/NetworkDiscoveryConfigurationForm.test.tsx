import { waitFor } from "@testing-library/react";

import { NetworkDiscoveryConfigurationForm } from "@/app/networkDiscovery/views";
import { authResolvers, mockAuth } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler({ ...mockAuth, is_superuser: true })
);

describe("DiscoveriesList", () => {
  it("renders ClearAllForm", async () => {
    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Clear all discoveries" })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
  });

  it("closes side panel form when canceled", async () => {
    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Clear all discoveries" })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("complementary", { name: "Clear all discoveries" })
    ).not.toBeInTheDocument();
  });
});
