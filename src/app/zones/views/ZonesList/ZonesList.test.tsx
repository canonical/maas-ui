import ZonesList from "./ZonesListTable/ZonesListTable";

import { zoneResolvers } from "@/testing/resolvers/zones";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.listZones.handler());

describe("ZonesList", () => {
  it("correctly fetches the necessary data", async () => {
    renderWithProviders(<ZonesList />);

    expect(await screen.findByText("zone-1")).toBeInTheDocument();
  });

  it("shows a zones table if there are any zones", async () => {
    renderWithProviders(<ZonesList />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows a message if there are no zones", async () => {
    mockServer.use(zoneResolvers.listZones.handler({ items: [], total: 0 }));
    renderWithProviders(<ZonesList />);

    await waitFor(() =>
      expect(screen.getByText("No zones available.")).toBeInTheDocument()
    );
  });
});
