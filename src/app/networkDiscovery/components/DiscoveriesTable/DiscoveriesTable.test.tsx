import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe } from "vitest";

import DiscoveriesTable from "./DiscoveriesTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { NetworkDiscoverySidePanelViews } from "@/app/networkDiscovery/constants";
import { Labels } from "@/app/networkDiscovery/views/DiscoveriesList/DiscoveriesList";
import { discovery } from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { networkDiscoveryResolvers } from "@/testing/resolvers/networkDiscovery";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  mockIsPending,
} from "@/testing/utils";

const mockServer = setupMockServer(
  networkDiscoveryResolvers.listNetworkDiscoveries.handler(),
  authResolvers.getCurrentUser.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("DiscoveriesTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

  describe("display", () => {
    it("displays a loading component if discoveries are loading", async () => {
      mockIsPending();
      renderWithProviders(<DiscoveriesTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        networkDiscoveryResolvers.listNetworkDiscoveries.handler({
          items: [],
          total: 0,
        })
      );
      renderWithProviders(<DiscoveriesTable />);

      await waitFor(() => {
        expect(
          screen.getByText("No discoveries available.")
        ).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<DiscoveriesTable />);

      ["Name", "Mac address", "IP", "Last seen", "Action"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it("opens add discovery side panel form", async () => {
      const mockDiscovery = discovery({ id: 1 });
      mockServer.use(
        networkDiscoveryResolvers.listNetworkDiscoveries.handler({
          items: [mockDiscovery],
          total: 1,
        })
      );

      renderWithProviders(<DiscoveriesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Toggle menu" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Toggle menu" })
      );

      await userEvent.click(
        screen.getByRole("button", { name: Labels.AddDiscovery })
      );

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: NetworkDiscoverySidePanelViews.ADD_DISCOVERY,
          extras: {
            discovery: mockDiscovery,
          },
        });
      });
    });

    it("opens delete discovery side panel form", async () => {
      const mockDiscovery = discovery({ id: 1 });
      mockServer.use(
        networkDiscoveryResolvers.listNetworkDiscoveries.handler({
          items: [mockDiscovery],
          total: 1,
        })
      );

      renderWithProviders(<DiscoveriesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Toggle menu" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Toggle menu" })
      );

      await userEvent.click(
        screen.getByRole("button", { name: Labels.DeleteDiscovery })
      );

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: NetworkDiscoverySidePanelViews.DELETE_DISCOVERY,
          extras: {
            discovery: mockDiscovery,
          },
        });
      });
    });
  });
});
