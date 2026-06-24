import { useMemo } from "react";

import { Button } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import DeleteScript from "../../components/DeleteScript";

import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import ScriptDetails from "@/app/settings/views/Scripts/ScriptDetails";
import type { Script } from "@/app/store/script/types";
import { formatUtcDatetime } from "@/app/utils/time";

type ScriptColumnDef = ColumnDef<Script, Partial<Script>>;

export enum Labels {
  Actions = "Actions",
}

const useScriptsTableColumns = ({
  canEdit,
}: {
  canEdit: boolean;
}): ScriptColumnDef[] => {
  const { openSidePanel } = useSidePanel();

  return useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        header: "Script name",
        cell: ({ row }) => (
          <Button
            appearance="link"
            className="p-button--link"
            onClick={() => {
              openSidePanel({
                component: ScriptDetails,
                title: "Script details",
                props: { id: row.original.id },
                size: "large",
              });
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        id: "description",
        accessorKey: "description",
        enableSorting: true,
        header: "Description",
      },
      {
        id: "created",
        accessorKey: "created",
        enableSorting: true,
        header: "Uploaded on",
        cell: ({ row }) => {
          return formatUtcDatetime(row.original.created);
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        enableSorting: false,
        header: Labels.Actions,
        cell: ({ row }) => (
          <TableActions
            deleteDisabled={!canEdit || row.original.default}
            deleteTooltip={
              !canEdit
                ? "You do not have permission to delete scripts."
                : row.original.default
                  ? "Default scripts cannot be deleted."
                  : null
            }
            onDelete={() => {
              openSidePanel({
                component: DeleteScript,
                title: "Delete script",
                props: { id: row.original.id },
              });
            }}
          />
        ),
      },
    ],
    [openSidePanel, canEdit]
  );
};

export default useScriptsTableColumns;
