import RequireEntitlements from "./RequireEntitlements";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("RequireEntitlements", () => {
  it("displays a permission message when the user lacks the entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <RequireEntitlements
        entitlements={[Entitlement.CAN_VIEW_GLOBAL_ENTITIES]}
      >
        <div>Child content</div>
      </RequireEntitlements>
    );

    expect(
      await screen.findByRole("heading", {
        name: /You do not have permission to view this page./,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });

  it("renders children when the user has the entitlement", async () => {
    renderWithProviders(
      <RequireEntitlements
        entitlements={[Entitlement.CAN_VIEW_GLOBAL_ENTITIES]}
      >
        <div>Child content</div>
      </RequireEntitlements>
    );

    expect(await screen.findByText("Child content")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /You do not have permission to view this page./,
        })
      ).not.toBeInTheDocument();
    });
  });
});
