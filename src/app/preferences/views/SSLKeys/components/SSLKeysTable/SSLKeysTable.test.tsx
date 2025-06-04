import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe } from "vitest";

import SSLKeysTable from "./SSLKeysTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { SSLKeyActionSidePanelViews } from "@/app/preferences/views/SSLKeys/constants";
import * as factory from "@/testing/factories";
import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
} from "@/testing/utils";

const mockServer = setupMockServer(sslKeyResolvers.listSslKeys.handler());

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("SSLKeysTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

  describe("display", () => {
    it("displays a loading component if SSL keys are loading", async () => {
      renderWithProviders(<SSLKeysTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        sslKeyResolvers.listSslKeys.handler({ items: [], total: 0 })
      );
      renderWithProviders(<SSLKeysTable />);

      await waitFor(() => {
        expect(screen.getByText("No SSL keys available.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<SSLKeysTable />);

      ["Key", "Action"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it("opens add SSL key side panel form", async () => {
      renderWithProviders(<SSLKeysTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Add SSL key" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Add SSL key" })
      );

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: SSLKeyActionSidePanelViews.ADD_SSL_KEY,
        });
      });
    });

    it("opens delete SSL key side panel form", async () => {
      mockServer.use(
        sslKeyResolvers.listSslKeys.handler({
          items: [
            factory.sslKey({
              id: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<SSLKeysTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: SSLKeyActionSidePanelViews.DELETE_SSL_KEY,
          extras: {
            sslKeyId: 1,
          },
        });
      });
    });
  });
});
