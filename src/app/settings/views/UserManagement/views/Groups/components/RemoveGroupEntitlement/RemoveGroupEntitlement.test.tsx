import RemoveGroupEntitlement from "./RemoveGroupEntitlement";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { groupsResolvers } from "@/testing/resolvers/groups";
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

const defaultProps = {
  group_id: 1,
  entitlement: Entitlement.CAN_DEPLOY_MACHINES,
  resource_id: 0,
  resource_type: "maas",
};

describe("RemoveGroupEntitlement", () => {
  it("closes the side panel when the cancel button is clicked", async () => {
    renderWithProviders(<RemoveGroupEntitlement {...defaultProps} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls remove entitlement on confirm click", async () => {
    renderWithProviders(<RemoveGroupEntitlement {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Remove entitlement/i })
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

    renderWithProviders(<RemoveGroupEntitlement {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Remove entitlement/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
