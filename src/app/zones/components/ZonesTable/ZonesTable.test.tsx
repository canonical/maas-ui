import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe } from "vitest";

import ZonesTable from "./ZonesTable";

import { useSidePanel } from "@/app/base/side-panel-context";
import { UserMeta } from "@/app/store/user/types";
import { ZoneActionSidePanelViews } from "@/app/zones/constants";
import * as factory from "@/testing/factories";
import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  screen,
  waitFor,
  setupMockServer,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  zoneResolvers.listZones.handler(),
  zoneResolvers.getZone.handler()
);

vi.mock("@/app/base/side-panel-context", async () => {
  const actual = await vi.importActual("@/app/base/side-panel-context");
  return {
    ...actual,
    useSidePanel: vi.fn(),
  };
});

describe("ZonesTable", () => {
  const mockSetSidePanelContent = vi.fn();

  (useSidePanel as Mock).mockReturnValue({
    setSidePanelContent: mockSetSidePanelContent,
  });

  describe("display", () => {
    it("displays a loading component if zones are loading", async () => {
      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(zoneResolvers.listZones.handler({ items: [], total: 0 }));
      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(screen.getByText("No zones found.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<ZonesTable />);

      [
        "Name",
        "Description",
        "Machines",
        "Devices",
        "Controllers",
        "Action",
      ].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("can show a machine filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "5" })
        ).toHaveAttribute("href", "/machines?zone=default");
      });
    });

    it("can show a device filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "2" })
        ).toHaveAttribute("href", "/devices?zone=default");
      });
    });

    it("can show a controller filter link", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              name: "default",
              machines_count: 5,
              devices_count: 2,
              controllers_count: 1,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(
          within(
            screen.getByRole("row", {
              name: new RegExp(`^default`, "i"),
            })
          ).getByRole("link", { name: "1" })
        ).toHaveAttribute("href", "/controllers");
      });
    });
  });

  // TODO: backend-provided permissions is only available for pools,
  //  and will be discussed as to whether they should be added everywhere.
  //  Enable these tests if they are added to zones
  describe("permissions", () => {
    it.skip("enables the action buttons with correct permissions");

    it.skip("disables the action buttons without permissions");

    it("disables the delete button for default zones", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              id: 1,
              name: "default",
              description: "default",
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeAriaDisabled();
      });
    });
  });

  describe("actions", () => {
    it("opens edit zones side panel form", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [factory.zone({ id: 1 })],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Edit" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Edit" }));

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: ZoneActionSidePanelViews.EDIT_ZONE,
          extras: {
            zoneId: 1,
          },
        });
      });
    });

    it("opens delete zone side panel form", async () => {
      mockServer.use(
        zoneResolvers.listZones.handler({
          items: [
            factory.zone({
              id: 2,
            }),
          ],
          total: 1,
        })
      );

      renderWithProviders(<ZonesTable />, {
        state: factory.rootState({
          [UserMeta.MODEL]: factory.userState({
            auth: factory.authState({
              user: factory.user({ is_superuser: true }),
            }),
          }),
        }),
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("button", { name: "Delete" }));

      await waitFor(() => {
        expect(mockSetSidePanelContent).toHaveBeenCalledWith({
          view: ZoneActionSidePanelViews.DELETE_ZONE,
          extras: {
            zoneId: 2,
          },
        });
      });
    });
  });
});
