import type { ColumnDef } from "@tanstack/react-table";

import DeleteGroup from "../../DeleteGroup";
import EditGroup from "../../EditGroup";

import type { UserGroupResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";

type GroupsListColumnData = UserGroupResponse & {
  statistics?: {
    user_count: number;
  };
};

export type GroupsListColumnDef = ColumnDef<
  GroupsListColumnData,
  Partial<GroupsListColumnData>
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
      cell: ({
        row: {
          original: { statistics },
        },
      }) => statistics?.user_count,
    },
    {
      id: "actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({
        row: {
          original: { id, statistics },
        },
      }) => (
        <TableActions
          onDelete={() => {
            openSidePanel({
              component: DeleteGroup,
              props: { id, user_count: statistics?.user_count ?? 0 },
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
