import { waitFor } from "@testing-library/react";

import NetworkDiscoveryHeader, {
  Labels as NetworkDiscoveryHeaderLabels,
} from "./NetworkDiscoveryHeader";

import urls from "@/app/base/urls";
import {
  mockNetworkDiscoveries,
  networkDiscoveryResolvers,
} from "@/testing/resolvers/networkDiscovery";
import {
  screen,
  renderWithBrowserRouter,
  userEvent,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(networkDiscoveryResolvers.listNetworkDiscoveries.handler());

describe("NetworkDiscoveryHeader", () => {
  it("displays the discovery count in the header", async () => {
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={vi.fn()} />
    );

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
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={vi.fn()} />
    );
    expect(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    ).toBeInTheDocument();
  });

  it("opens the side panel when the 'Clear all discoveries' button is clicked", async () => {
    const setSidePanelContent = vi.fn();
    renderWithBrowserRouter(
      <NetworkDiscoveryHeader setSidePanelContent={setSidePanelContent} />
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    );
    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ["", "clearAllDiscoveries"],
    });
  });
});
