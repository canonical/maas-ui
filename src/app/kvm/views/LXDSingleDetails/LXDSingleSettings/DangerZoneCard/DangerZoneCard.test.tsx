import DangerZoneCard from "./DangerZoneCard";

import DeleteForm from "@/app/kvm/components/DeleteForm";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  screen,
  setupMockServer,
  userEvent,
  renderWithProviders,
  waitFor,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("DangerZoneCard", () => {
  it("can open the delete KVM form", async () => {
    renderWithProviders(<DangerZoneCard hostId={1} message="Delete KVM" />);
    await waitFor(() => {
      expect(screen.getByTestId("remove-kvm")).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByTestId("remove-kvm"));

    expect(mockOpen).toHaveBeenCalledWith({
      component: DeleteForm,
      title: "Delete KVM",
      props: {
        hostId: 1,
      },
    });
  });

  it("disables the remove button without the edit machines entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<DangerZoneCard hostId={1} message="Delete KVM" />);
    await waitFor(() => {
      expect(screen.getByTestId("remove-kvm")).toBeAriaDisabled();
    });
    await userEvent.click(screen.getByTestId("remove-kvm"));
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("can display message", () => {
    renderWithProviders(
      <DangerZoneCard
        hostId={1}
        message={<span data-testid="message">Delete KVM</span>}
      />
    );
    expect(screen.getByTestId("message")).toHaveTextContent("Delete KVM");
  });
});
