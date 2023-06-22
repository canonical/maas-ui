import DangerZoneCard from "./DangerZoneCard";

import { KVMSidePanelViews } from "app/kvm/constants";
import { render, screen, userEvent } from "testing/utils";

describe("DangerZoneCard", () => {
  it("can open the delete KVM form", async () => {
    const setSidePanelContent = jest.fn();
    render(
      <DangerZoneCard
        hostId={1}
        message="Delete KVM"
        setSidePanelContent={setSidePanelContent}
      />
    );
    await userEvent.click(screen.getByTestId("remove-kvm"));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.DELETE_KVM,
      extras: {
        hostId: 1,
      },
    });
  });

  it("can display message", () => {
    const setSidePanelContent = jest.fn();
    render(
      <DangerZoneCard
        hostId={1}
        message={<span data-testid="message">Delete KVM</span>}
        setSidePanelContent={setSidePanelContent}
      />
    );
    expect(screen.getByTestId("message")).toHaveTextContent("Delete KVM");
  });
});
