import { waitFor } from "@testing-library/react";

import NetworkDiscoveryHeader, {
  Labels as NetworkDiscoveryHeaderLabels,
} from "./NetworkDiscoveryHeader";

import urls from "@/app/base/urls";
import { ClearAllForm } from "@/app/networkDiscovery/components";
import {
  mockNetworkDiscoveries,
  networkDiscoveryResolvers,
} from "@/testing/resolvers/networkDiscovery";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
  mockSidePanel,
} from "@/testing/utils";

setupMockServer(networkDiscoveryResolvers.listNetworkDiscoveries.handler());
const { mockOpen } = await mockSidePanel();

describe("NetworkDiscoveryHeader", () => {
  it("displays the discovery count in the header", async () => {
    renderWithProviders(<NetworkDiscoveryHeader />);

    await waitFor(() => {
      expect(
        screen.getByText(`${mockNetworkDiscoveries.total} discoveries`)
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(`${mockNetworkDiscoveries.total} discoveries`)
    ).toHaveAttribute("href", urls.networkDiscovery.index);
  });

  it("has a button to clear discoveries", () => {
    renderWithProviders(<NetworkDiscoveryHeader />);
    expect(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    ).toBeInTheDocument();
  });

  it("opens the side panel when the 'Clear all discoveries' button is clicked", async () => {
    renderWithProviders(<NetworkDiscoveryHeader />);

    await userEvent.click(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    );
    expect(mockOpen).toHaveBeenCalledWith({
      component: ClearAllForm,
      title: "Clear all discoveries",
    });
  });
});
