import ZonesListHeader from "./ZonesListHeader";

import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

describe("ZonesListHeader", () => {
  it("displays the form when Add AZ is clicked", async () => {
    renderWithBrowserRouter(<ZonesListHeader />);

    expect(
      screen.queryByRole("form", { name: "Add AZ" })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));

    expect(screen.getByRole("form", { name: "Add AZ" })).toBeInTheDocument();
  });
});
