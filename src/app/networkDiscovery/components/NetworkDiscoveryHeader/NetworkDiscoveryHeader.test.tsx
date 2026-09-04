import NetworkDiscoveryHeader, {
  Labels as NetworkDiscoveryHeaderLabels,
} from "./NetworkDiscoveryHeader";

import { ClearAllForm } from "@/app/networkDiscovery/components";
import { authResolvers } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import {
  screen,
  renderWithProviders,
  userEvent,
  setupMockServer,
  mockSidePanel,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);
const { mockOpen } = await mockSidePanel();

describe("NetworkDiscoveryHeader", () => {
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

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: NetworkDiscoveryHeaderLabels.ClearAll,
        })
      ).not.toBeAriaDisabled();
    });

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

  it("disables the clear all button without the edit entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<NetworkDiscoveryHeader />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: NetworkDiscoveryHeaderLabels.ClearAll,
        })
      ).toBeAriaDisabled();
    });

    await userEvent.click(
      screen.getByRole("button", {
        name: NetworkDiscoveryHeaderLabels.ClearAll,
      })
    );
    expect(mockOpen).not.toHaveBeenCalled();
  });
});
