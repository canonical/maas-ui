import RemoveGroupMember from "./RemoveGroupMember";

import { groupsResolvers } from "@/testing/resolvers/groups";
import {
  userEvent,
  screen,
  setupMockServer,
  renderWithProviders,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const mockServer = setupMockServer(groupsResolvers.removeGroupMember.handler());
const { mockClose } = await mockSidePanel();

const defaultProps = {
  group_id: 1,
  user_id: 1,
};

describe("RemoveGroupMember", () => {
  it("closes the side panel when the cancel button is clicked", async () => {
    renderWithProviders(<RemoveGroupMember {...defaultProps} />);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("calls remove member on confirm click", async () => {
    renderWithProviders(<RemoveGroupMember {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Remove member/i })
    );

    await waitFor(() => {
      expect(groupsResolvers.removeGroupMember.resolved).toBeTruthy();
    });
  });

  it("displays error message when remove member fails", async () => {
    mockServer.use(
      groupsResolvers.removeGroupMember.error({
        code: 400,
        message: "Uh oh!",
        kind: "Error",
      })
    );

    renderWithProviders(<RemoveGroupMember {...defaultProps} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Remove member/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/Uh oh!/i)).toBeInTheDocument();
    });
  });
});
