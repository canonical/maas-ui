import ZonesList from "./ZonesListTable/ZonesListTable";

import { zoneResolvers } from "@/app/api/query/zones.test";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(zoneResolvers.listZones.handler());

beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => {
  mockServer.resetHandlers();
});
afterAll(() => mockServer.close());

describe("ZonesList", () => {
  it("correctly fetches the necessary data", async () => {
    renderWithBrowserRouter(<ZonesList />, {
      route: "/zones",
    });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(await screen.findByText("zone-1")).toBeInTheDocument();
  });

  it("shows a zones table if there are any zones", async () => {
    renderWithBrowserRouter(<ZonesList />, { route: "/zones" });
    await waitFor(() => expect(zoneResolvers.listZones.resolved).toBeTruthy());

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("shows a message if there are no zones", async () => {
    renderWithBrowserRouter(<ZonesList />, { route: "/zones" });

    expect(screen.getByText("No zones available.")).toBeInTheDocument();
  });
});
