import type { ColumnDef } from "@tanstack/react-table";

import type { EntitlementResponse, UserGroupResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import RemoveGroupEntitlement from "@/app/settings/views/UserManagement/views/Groups/components/RemoveGroupEntitlement";

export type EntitlementColumnDef = ColumnDef<
  EntitlementResponse & { id: string },
  Partial<EntitlementResponse & { id: string }>
>;

const useGroupEntitlementsTableColumns = ({
  group_id,
}: {
  group_id: UserGroupResponse["id"];
}): EntitlementColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  return [
    {
      id: "entitlement",
      accessorKey: "entitlement",
      enableSorting: true,
    },
    {
      id: "resource_id",
      accessorKey: "resource_type",
      enableSorting: true,
      header: "Applies to",
    },
    {
      id: "actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({
        row: {
          original: { entitlement, resource_id, resource_type },
        },
      }) => (
        <TableActions
          onDelete={() => {
            openSidePanel({
              component: RemoveGroupEntitlement,
              title: "Remove entitlement",
              props: { group_id, entitlement, resource_id, resource_type },
            });
          }}
        />
      ),
    },
  ] as EntitlementColumnDef[];
};

export default useGroupEntitlementsTableColumns;
