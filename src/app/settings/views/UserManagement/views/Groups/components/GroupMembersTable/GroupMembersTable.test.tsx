import GroupMembersTable from "./GroupMembersTable";

import RemoveGroupMember from "@/app/settings/views/UserManagement/views/Groups/components/RemoveGroupMember";
import { groupsResolvers, mockGroupMembers } from "@/testing/resolvers/groups";
import {
  renderWithProviders,
  setupMockServer,
  userEvent,
  screen,
  mockIsPending,
  waitFor,
  mockSidePanel,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();

const mockServer = setupMockServer(groupsResolvers.listGroupMembers.handler());

describe("GroupMembersTable", () => {
  describe("display", () => {
    it("displays a loading component if members are loading", async () => {
      mockIsPending();
      renderWithProviders(<GroupMembersTable id={1} />);

      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });
    });

    it("displays a message when rendering an empty list", async () => {
      mockServer.use(groupsResolvers.listGroupMembers.handler({ items: [] }));
      renderWithProviders(<GroupMembersTable id={1} />);

      await waitFor(() => {
        expect(screen.getByText("No group members found.")).toBeInTheDocument();
      });
    });

    it("displays the columns correctly", () => {
      renderWithProviders(<GroupMembersTable id={1} />);

      ["Username", "Email", "Actions"].forEach((column) => {
        expect(
          screen.getByRole("columnheader", {
            name: new RegExp(`^${column}`, "i"),
          })
        ).toBeInTheDocument();
      });
    });

    it("displays member rows", async () => {
      renderWithProviders(<GroupMembersTable id={1} />);

      await waitFor(() => {
        mockGroupMembers.items.forEach(({ username }) => {
          expect(screen.getByText(username)).toBeInTheDocument();
        });
      });
    });
  });

  describe("actions", () => {
    it("opens the RemoveGroupMember side panel when clicking Remove member", async () => {
      renderWithProviders(<GroupMembersTable id={1} />);

      await waitFor(() => {
        expect(
          screen.getAllByRole("button", { name: "Toggle menu" }).length
        ).toBeGreaterThan(0);
      });

      await userEvent.click(
        screen.getAllByRole("button", { name: "Toggle menu" })[0]
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Remove member..." })
      );

      const selectedMember = mockGroupMembers.items[0];
      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          component: RemoveGroupMember,
          title: "Remove member",
          props: expect.objectContaining({
            group_id: 1,
            user_id: selectedMember.user_id,
          }),
        })
      );
    });
  });
});
