import type { ColumnDef } from "@tanstack/react-table";

import DeleteGroup from "../../DeleteGroup";
import EditGroup from "../../EditGroup";

import type { UserGroupResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";

export type GroupsListColumnDef = ColumnDef<
  UserGroupResponse,
  Partial<UserGroupResponse>
>;

const useGroupsListColumns = (): GroupsListColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: "Group name",
    },
    {
      id: "description",
      accessorKey: "description",
      enableSorting: false,
    },
    {
      id: "user_count",
      accessorKey: "user_count",
      enableSorting: true,
      header: "User count",
    },
    {
      id: "actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({
        row: {
          original: { id },
        },
      }) => (
        <TableActions
          onDelete={() => {
            openSidePanel({
              component: DeleteGroup,
              props: { id },
              title: "Delete group",
            });
          }}
          onEdit={() => {
            openSidePanel({
              component: EditGroup,
              props: { id },
              title: "Edit group",
            });
          }}
        />
      ),
    },
  ] as GroupsListColumnDef[];
};

export default useGroupsListColumns;
