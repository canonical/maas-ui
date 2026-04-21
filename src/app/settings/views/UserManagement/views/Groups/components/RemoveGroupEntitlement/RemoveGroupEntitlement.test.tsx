import RemoveGroupEntitlement from "./RemoveGroupEntitlement";

import {
  groupsResolvers,
  mockGroupEntitlements,
} from "@/testing/resolvers/groups";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(
  groupsResolvers.removeGroupEntitlement.handler()
);
const { mockClose } = await mockSidePanel();

describe("RemoveGroupEntitlement", () => {
  it("closes the side panel when the cancel button is clicked", async () => {
    renderWithProviders(
      <RemoveGroupEntitlement
        entitlements={mockGroupEntitlements.items}
        group_id={1}
        setEntitlementSelection={vi.fn}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls remove entitlement on confirm click", async () => {
    renderWithProviders(
      <RemoveGroupEntitlement
        entitlements={mockGroupEntitlements.items}
        group_id={1}
        setEntitlementSelection={vi.fn}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Remove 2 entitlements/i })
    );

    await waitFor(() => {
      expect(groupsResolvers.removeGroupEntitlement.resolved).toBeTruthy();
    });
  });

  it("displays error message when remove entitlement fails", async () => {
    mockServer.use(
      groupsResolvers.removeGroupEntitlement.error({
        code: 400,
        message: "Uh oh!",
        kind: "Error",
      })
    );

    renderWithProviders(
      <RemoveGroupEntitlement
        entitlements={mockGroupEntitlements.items}
        group_id={1}
        setEntitlementSelection={vi.fn}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Remove 2 entitlements/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
