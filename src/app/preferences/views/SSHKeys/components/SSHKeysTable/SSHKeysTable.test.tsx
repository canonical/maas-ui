import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe } from "vitest";

import SSHKeysTable from "./SSHKeysTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";
import * as factory from "@/testing/factories";
import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  mockIsPending,
} from "@/testing/utils";

const mockServer = setupMockServer(sshKeyResolvers.listSshKeys.handler());

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("SSHKeysTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

  describe("display", () => {
    it("displays a loading component if SSH keys are loading", async () => {
      mockIsPending();
      renderWithProviders(<SSHKeysTable isIntro={false} />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        sshKeyResolvers.listSshKeys.handler({ items: [], total: 0 })
      );
      renderWithProviders(<SSHKeysTable isIntro={false} />);

      await waitFor(() => {
        expect(screen.getByText("No SSH keys available.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<SSHKeysTable isIntro={false} />);

      ["Source", "ID", "Key", "Action"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe("permissions", () => {
    it.skip("enables the action buttons with correct permissions");

    it.skip("disables the action buttons without permissions");
  });

  describe("actions", () => {
    it("opens add SSH key side panel form", async () => {
      renderWithProviders(<SSHKeysTable isIntro={false} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Import SSH key" })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Import SSH key" })
      );

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: SSHKeyActionSidePanelViews.ADD_SSH_KEY,
        });
      });
    });

    it("opens delete SSH key side panel form", async () => {
      mockServer.use(
        sshKeyResolvers.listSshKeys.handler({
          items: [
            factory.sshKey({
              id: 1,
            }),
            factory.sshKey({
              id: 2,
            }),
          ],
          total: 2,
        })
      );

      renderWithProviders(<SSHKeysTable isIntro={false} />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: SSHKeyActionSidePanelViews.DELETE_SSH_KEY,
          extras: {
            sshKeyIds: [1, 2],
          },
        });
      });
    });
  });
});
