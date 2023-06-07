import ZonesListHeader from "./ZonesListHeader";

import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

describe("ZonesListHeader", () => {
  it("displays the form when Add AZ is clicked", async () => {
    const setSidePanelContent = jest.fn();
    renderWithBrowserRouter(
      <ZonesListHeader setSidePanelContent={setSidePanelContent} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: ["zoneForm", "createZone"],
    });
  });
});
