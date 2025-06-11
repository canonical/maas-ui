import ZonesListHeader from "./ZonesListHeader";

import { SidePanelViews } from "@/app/base/side-panel-context";
import { userEvent, screen, renderWithProviders } from "@/testing/utils";

describe("ZonesListHeader", () => {
  it("displays the form when Add AZ is clicked", async () => {
    const setSidePanelContent = vi.fn();
    renderWithProviders(
      <ZonesListHeader setSidePanelContent={setSidePanelContent} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add AZ" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: SidePanelViews.CREATE_ZONE,
    });
  });
});
