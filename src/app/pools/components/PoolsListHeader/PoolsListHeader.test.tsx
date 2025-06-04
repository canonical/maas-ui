import { SidePanelViews } from "@/app/base/side-panel-context";
import PoolsListHeader from "@/app/pools/components/PoolsListHeader/PoolsListHeader";
import { userEvent, screen, renderWithProviders } from "@/testing/utils";

describe("PoolsListHeader", () => {
  it("displays the form when Add AZ is clicked", async () => {
    const setSidePanelContent = vi.fn();
    renderWithProviders(
      <PoolsListHeader setSidePanelContent={setSidePanelContent} />
    );

    await userEvent.click(screen.getByRole("button", { name: "Add pool" }));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: SidePanelViews.CREATE_POOL,
    });
  });
});
