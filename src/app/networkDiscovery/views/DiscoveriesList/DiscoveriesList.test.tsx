import { waitFor } from "@testing-library/react";

import DiscoveriesList from "./DiscoveriesList";

import ClearAllForm from "@/app/networkDiscovery/components/ClearAllForm";
import DiscoveryDeleteForm from "@/app/networkDiscovery/components/DiscoveryDeleteForm";
import { authResolvers } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import {
  mockModal,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler(),
  authResolvers.getMeStatistics.handler()
);
const { mockOpen: mockOpenModal } = await mockModal();

describe("DiscoveriesList", () => {
  it("renders AddDiscovery when a valid discovery is provided", async () => {
    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Toggle menu" }));
    });
    await userEvent.click(
      screen.getAllByRole("button", { name: "Toggle menu" })[0]
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Add discovery..." })
    );
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Add discovery" })
      ).toBeInTheDocument();
    });
  });

  it("opens the DeleteDiscovery modal when a valid discovery is provided", async () => {
    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Toggle menu" }));
    });
    await userEvent.click(
      screen.getAllByRole("button", { name: "Toggle menu" })[0]
    );
    await userEvent.click(
      screen.getByRole("menuitem", { name: "Delete discovery..." })
    );
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: DiscoveryDeleteForm,
        title: "Delete discovery",
      })
    );
  });

  it("opens the ClearAllForm modal", async () => {
    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Clear all discoveries" }));
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Clear all discoveries" })
    );
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        component: ClearAllForm,
        title: "Clear all discoveries",
      })
    );
  });
});
