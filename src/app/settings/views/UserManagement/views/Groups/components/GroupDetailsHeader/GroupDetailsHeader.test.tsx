import GroupDetailsHeader from "./GroupDetailsHeader";

import urls from "@/app/settings/urls";
import AddEntitlement from "@/app/settings/views/UserManagement/views/Groups/components/AddEntitlement";
import AddMembers from "@/app/settings/views/UserManagement/views/Groups/components/AddMembers/AddMembers";
import DeleteGroup from "@/app/settings/views/UserManagement/views/Groups/components/DeleteGroup";
import EditGroup from "@/app/settings/views/UserManagement/views/Groups/components/EditGroup";
import { group as groupFactory } from "@/testing/factories/groups";
import {
  groupsResolvers,
  mockGroupStatistics,
} from "@/testing/resolvers/groups";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
  mockSidePanel,
  waitForLoading,
} from "@/testing/utils";

setupMockServer(groupsResolvers.listGroupsStatistics.handler());

const { mockOpen } = await mockSidePanel();

const mockGroup = groupFactory({ id: 1, name: "test-group" });

describe("GroupDetailsHeader", () => {
  describe("display", () => {
    it("displays a spinner as the title when loading", () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={undefined}
          loading={true}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );

      expect(
        screen.getByTestId("section-header-title-spinner")
      ).toBeInTheDocument();
    });

    it("displays the group name as the title when loaded", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );
      await waitForLoading();

      expect(
        screen.getByRole("heading", {
          name: new RegExp(`^${mockGroup.name}`, "i"),
        })
      ).toBeInTheDocument();
    });

    it("renders tab links for Entitlements and Members", () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );

      expect(
        screen.getByRole("link", { name: "Entitlements" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Members" })).toBeInTheDocument();
    });

    it("renders a Back to all groups link pointing to the groups url", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );
      await waitForLoading();

      const link = screen.getByRole("link", { name: /back to all groups/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", urls.userManagement.groups);
    });

    it("shows all action menu items when Take action is clicked", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );

      const actionLabels = ["Edit group...", "Delete group..."];
      actionLabels.forEach((label) => {
        expect(
          screen.queryByRole("button", { name: label })
        ).not.toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Take action" })
      );

      actionLabels.forEach((label) => {
        expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
      });
    });
  });

  describe("actions", () => {
    it("opens Add entitlement side panel on click", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );
      await waitForLoading();

      await userEvent.click(
        screen.getByRole("button", { name: "Add entitlement" })
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          component: AddEntitlement,
          title: "Add entitlement",
          props: { group_id: mockGroup.id },
        })
      );
    });

    it("opens Add members side panel on click", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/members`,
          ],
        }
      );
      await waitForLoading();

      await userEvent.click(
        screen.getByRole("button", { name: "Add members" })
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          component: AddMembers,
          title: "Add members",
          props: { group_id: mockGroup.id },
          size: "large",
        })
      );
    });

    it("opens Edit group side panel on click", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Take action" })
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Edit group..." })
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          component: EditGroup,
          title: "Edit group",
          props: { id: mockGroup.id },
        })
      );
    });

    it("opens Delete group side panel on click with user count from statistics", async () => {
      renderWithProviders(
        <GroupDetailsHeader
          entitlementSelection={[]}
          group={mockGroup}
          loading={false}
          memberSelection={[]}
          setEntitlementSelection={vi.fn}
          setMemberSelection={vi.fn}
        />,
        {
          initialEntries: [
            `/settings/user-management/group/${mockGroup.id}/entitlements`,
          ],
        }
      );

      await waitFor(() => {
        expect(groupsResolvers.listGroupsStatistics.resolved).toBeTruthy();
      });

      await userEvent.click(
        screen.getByRole("button", { name: "Take action" })
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Delete group..." })
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.objectContaining({
          component: DeleteGroup,
          title: "Delete group",
          props: {
            id: mockGroup.id,
            user_count: mockGroupStatistics.items[0].user_count,
          },
        })
      );
    });
  });
});
