import ZonesList from "./ZonesListTable/ZonesListTable";

import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("ZonesList", () => {
  it("correctly fetches the necessary data", async () => {
    const queryData = { zones: [factory.zone({ name: "zone-1" })] };
    renderWithBrowserRouter(<ZonesList />, {
      route: "/zones",
      queryData,
    });

    expect(await screen.findByText("zone-1")).toBeInTheDocument();
  });

  it("shows a zones table if there are any zones", () => {
    const queryData = {
      zones: [factory.zone({ name: "test" })],
    };
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", queryData });

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("shows a message if there are no zones", () => {
    const queryData = { zones: [] };
    renderWithBrowserRouter(<ZonesList />, { route: "/zones", queryData });

    expect(screen.getByText("No zones available.")).toBeInTheDocument();
  });
});
