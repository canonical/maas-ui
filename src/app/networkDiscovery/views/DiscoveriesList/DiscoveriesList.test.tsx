import { waitFor } from "@testing-library/react";

import type { NetworkDiscoverySidePanelContent } from "../../constants";
import { NetworkDiscoverySidePanelViews } from "../../constants";

import DiscoveriesList from "./DiscoveriesList";

import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockNetworkDiscoveries,
  networkDiscoveryResolvers,
} from "@/testing/resolvers/networkDiscovery";
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

  it("renders AddDiscovery when view is ADD_DISCOVERY and a valid discovery is provided", async () => {
    mockSidePanelContent = {
      view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
      extras: { discovery: mockNetworkDiscoveries.items[0] },
    };

    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Add discovery" })
      ).toBeInTheDocument();
    });
  });

  it("renders DeleteDiscovery when view is DELETE_DISCOVERY and a valid discovery is provided", async () => {
    mockSidePanelContent = {
      view: NetworkDiscoverySidePanelViews.DELETE_DISCOVERY,
      extras: { discovery: mockNetworkDiscoveries.items[0] },
    };

    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Delete discovery" })
      ).toBeInTheDocument();
    });
  });

  it("renders ClearAllForm when view is CLEAR_ALL_DISCOVERIES", async () => {
    mockSidePanelContent = {
      view: NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES,
    };

    renderWithProviders(<DiscoveriesList />);
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

    renderWithProviders(<DiscoveriesList />);
    await waitFor(() => {
      expect(
        screen.getByRole("complementary", { name: "Clear all discoveries" })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSetSidePanelContent).toHaveBeenCalledWith(null);
  });
});
