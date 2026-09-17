import SwitchesTable from "./SwitchesTable";

import { authResolvers } from "@/testing/resolvers/auth";
import { switchResolvers } from "@/testing/resolvers/switches";
import {
  mockIsPending,
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  switchResolvers.listSwitches.handler(),
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("SwitchesTable", () => {
  describe("display", () => {
    it("displays a loading component if switches are loading", async () => {
      mockIsPending();
      renderWithProviders(<SwitchesTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(
        switchResolvers.listSwitches.handler({ items: [], total: 0 })
      );
      renderWithProviders(<SwitchesTable />);

      await waitFor(() => {
        expect(screen.getByText("No switches available.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<SwitchesTable />);

      ["Name", "Image", "Actions"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it.todo("opens edit switch side panel form");

    it.todo("opens delete switch side panel form");

    it("disables the table actions without the edit entitlement", async () => {
      mockServer.use(authResolvers.getMeEntitlements.handler([]));
      renderWithProviders(<SwitchesTable />);

      await waitFor(() => {
        expect(
          screen.getAllByRole("button", { name: "Edit" })[0]
        ).toBeAriaDisabled();
      });
      expect(
        screen.getAllByRole("button", { name: "Delete" })[0]
      ).toBeAriaDisabled();
    });
  });
});
