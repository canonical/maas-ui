import type { Dispatch, SetStateAction } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { ContextualMenu } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import type {
  UserGroupMemberResponse,
  UserGroupResponse,
} from "@/app/apiclient";
import RemoveGroupMember from "@/app/settings/views/UserManagement/views/Groups/components/RemoveGroupMember";

export type MemberColumnDef = ColumnDef<
  UserGroupMemberResponse & { id: string },
  Partial<UserGroupMemberResponse & { id: string }>
>;

const useGroupMembersTableColumns = ({
  canEdit,
  groupId,
  setMemberSelection,
}: {
  canEdit: boolean;
  groupId: UserGroupResponse["id"];
  setMemberSelection: Dispatch<SetStateAction<UserGroupMemberResponse[]>>;
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
          original: { user_id, username, email },
        },
      }) => (
        <ContextualMenu
          hasToggleIcon
          links={[
            {
              children: "Remove member...",
              onClick: () => {
                openSidePanel({
                  component: RemoveGroupMember,
                  title: "Remove member",
                  props: {
                    groupId,
                    members: [{ user_id, username, email }],
                    setMemberSelection,
                  },
                });
              },
            },
          ]}
          toggleAppearance="base"
          toggleClassName="u-no-margin--bottom is-small is-dense"
          toggleDisabled={!canEdit}
        />
      ),
    },
  ] as MemberColumnDef[];
};

export default useGroupMembersTableColumns;
