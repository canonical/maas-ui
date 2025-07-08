import { waitFor } from "@testing-library/react";

import type { NetworkDiscoverySidePanelContent } from "../../constants";
import { NetworkDiscoverySidePanelViews } from "../../constants";

import { NetworkDiscoveryConfigurationForm } from "@/app/networkDiscovery/views";
import { authResolvers } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import {
  userEvent,
  screen,
  renderWithProviders,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler()
);

let mockSidePanelContent: NetworkDiscoverySidePanelContent | null = null;
const mockSetSidePanelContent = vi.fn();

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: () => ({
      sidePanelContent: mockSidePanelContent,
      setSidePanelContent: mockSetSidePanelContent,
      sidePanelSize: "regular",
      setSidePanelSize: vi.fn(),
    }),
  };
});

describe("DiscoveriesList", () => {
  beforeEach(() => {
    mockSetSidePanelContent.mockClear();
    mockSidePanelContent = null;
  });

  it("renders ClearAllForm when view is CLEAR_ALL_DISCOVERIES", async () => {
    mockSidePanelContent = {
      view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
    };

    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
  });

  it("closes side panel form when canceled", async () => {
    mockSidePanelContent = {
      view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
    };

    renderWithProviders(<NetworkDiscoveryConfigurationForm />);
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
