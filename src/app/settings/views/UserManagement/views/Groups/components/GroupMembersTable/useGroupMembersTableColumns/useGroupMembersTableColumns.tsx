import type { ColumnDef } from "@tanstack/react-table";

import type {
  UserGroupMemberResponse,
  UserGroupResponse,
} from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import RemoveGroupMember from "@/app/settings/views/UserManagement/views/Groups/components/RemoveGroupMember";

export type MemberColumnDef = ColumnDef<
  UserGroupMemberResponse & { id: string },
  Partial<UserGroupMemberResponse & { id: string }>
>;

const useGroupMembersTableColumns = ({
  group_id,
}: {
  group_id: UserGroupResponse["id"];
}): MemberColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  return [
    {
      id: "username",
      accessorKey: "username",
      enableSorting: true,
    },
    {
      id: "email",
      accessorKey: "email",
      enableSorting: true,
    },
    {
      id: "actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({
        row: {
          original: { user_id },
        },
      }) => (
        <TableActions
          onDelete={() => {
            openSidePanel({
              component: RemoveGroupMember,
              title: "Remove member",
              props: { group_id, user_id },
            });
          }}
        />
      ),
    },
  ] as MemberColumnDef[];
};

export default useGroupMembersTableColumns;
