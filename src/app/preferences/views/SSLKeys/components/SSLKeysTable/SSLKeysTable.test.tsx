import { describe } from "vitest";

import SSLKeysTable from "./SSLKeysTable";

import { sslKeyResolvers } from "@/testing/resolvers/sslKeys";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  mockIsPending,
} from "@/testing/utils";

const mockServer = setupMockServer(sslKeyResolvers.listSslKeys.handler());

describe("SSLKeysTable", () => {
  describe("display", () => {
    it("displays a loading component if SSL keys are loading", async () => {
      mockIsPending();
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
});
