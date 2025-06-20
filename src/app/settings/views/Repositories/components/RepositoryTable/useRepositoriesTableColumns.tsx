import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { RepositoryActionSidePanelViews } from "../../constants";

import type { PackageRepositoryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import {
  getIsDefaultRepo,
  getRepoDisplayName,
} from "@/app/store/packagerepository/utils";

type RepositoriesColumnDef = ColumnDef<
  PackageRepositoryResponse,
  Partial<PackageRepositoryResponse>
>;

const useRepositoriesTableColumns = (): RepositoriesColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();

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
        id: "action",
        accessorKey: "id",
        header: "Actions",
        cell: ({ row: { original } }) => (
          <TableActions
            deleteDisabled={getIsDefaultRepo(original)}
            deleteTooltip={
              getIsDefaultRepo(original)
                ? "Default repositories cannot be deleted."
                : null
            }
            onDelete={() => {
              setSidePanelContent({
                view: RepositoryActionSidePanelViews.DELETE_REPOSITORY,
                extras: { repositoryId: original.id },
              });
            }}
            onEdit={() => {
              setSidePanelContent({
                view: RepositoryActionSidePanelViews.EDIT_REPOSITORY,
                extras: {
                  repositoryId: original.id,
                  type: original.url.startsWith("ppa:") ? "ppa" : "repository",
                },
              });
            }}
          />
        ),
      },
    ],
    [setSidePanelContent]
  );
};

export default useRepositoriesTableColumns;
