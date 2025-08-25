import { describe } from "vitest";

import SSHKeysTable from "./SSHKeysTable";

import { sshKeyResolvers } from "@/testing/resolvers/sshKeys";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  mockIsPending,
} from "@/testing/utils";

const mockServer = setupMockServer(sshKeyResolvers.listSshKeys.handler());

describe("SSHKeysTable", () => {
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
});
