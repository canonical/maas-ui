import { useMemo } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import type { ColumnDef } from "@tanstack/react-table";

import type { PackageRepositoryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import {
  DeleteRepository,
  EditRepository,
} from "@/app/settings/views/Repositories/components";
import {
  getIsDefaultRepo,
  getRepoDisplayName,
} from "@/app/settings/views/Repositories/utils";

type RepositoriesColumnDef = ColumnDef<
  PackageRepositoryResponse,
  Partial<PackageRepositoryResponse>
>;

const useRepositoriesTableColumns = ({
  canEdit,
}: {
  canEdit: boolean;
}): RepositoriesColumnDef[] => {
  const { openSidePanel } = useSidePanel();

  return useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        header: "Name",
        cell: ({ row: { original } }) =>
          getRepoDisplayName(original.name) || <>&mdash;</>,
      },
      {
        id: "url",
        accessorKey: "url",
        enableSorting: true,
        header: "URL",
        cell: ({ row: { original } }) => original.url || <>&mdash;</>,
      },
      {
        id: "enabled",
        accessorKey: "enabled",
        enableSorting: true,
        header: "Enabled",
        cell: ({ row: { original } }) => (original.enabled ? "Yes" : "No"),
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: ({ row: { original } }) => (
          <TableActions
            deleteDisabled={getIsDefaultRepo(original) || !canEdit}
            deleteTooltip={
              getIsDefaultRepo(original)
                ? "Default repositories cannot be deleted."
                : !canEdit
                  ? "You do not have permission to delete repositories."
                  : null
            }
            editDisabled={!canEdit}
            editTooltip={
              !canEdit
                ? "You do not have permission to edit repositories."
                : null
            }
            onDelete={() => {
              openSidePanel({
                component: DeleteRepository,
                title: "Delete repository",
                props: {
                  id: original.id,
                },
              });
            }}
            onEdit={() => {
              openSidePanel({
                component: EditRepository,
                title: "Edit repository",
                props: {
                  id: original.id,
                  type: original.url.startsWith("ppa:") ? "ppa" : "repository",
                },
              });
            }}
          />
        ),
      },
    ],
    [canEdit, openSidePanel]
  );
};

export default useRepositoriesTableColumns;
