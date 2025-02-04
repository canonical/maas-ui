import ZonesList from "./ZonesListTable/ZonesListTable";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(zoneResolvers.listZones.handler());

describe("ZonesList", () => {
  it("correctly fetches the necessary data", async () => {
    renderWithBrowserRouter(<ZonesList />, {
      route: "/zones",
    });

    expect(await screen.findByText("zone-1")).toBeInTheDocument();
  });

  it("shows a zones table if there are any zones", async () => {
    renderWithBrowserRouter(<ZonesList />, { route: "/zones" });

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("shows a message if there are no zones", async () => {
    renderWithBrowserRouter(<ZonesList />, { route: "/zones" });

    expect(screen.getByText("No zones available.")).toBeInTheDocument();
  });
});
