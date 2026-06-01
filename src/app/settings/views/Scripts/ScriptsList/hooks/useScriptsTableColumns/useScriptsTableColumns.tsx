import { useMemo } from "react";

import { Button } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context";
import ScriptDetails from "@/app/settings/views/Scripts/ScriptDetails";
import DeleteScript from "@/app/settings/views/Scripts/ScriptsList/components/DeleteScript/DeleteScript";
import type { Script } from "@/app/store/script/types";
import { formatUtcDatetime } from "@/app/utils/time";

type ScriptColumnDef = ColumnDef<Script, Partial<Script>>;

export enum Labels {
  Actions = "Actions",
}

const useScriptsTableColumns = (): ScriptColumnDef[] => {
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
        id: "uploaded_on",
        accessorKey: "created",
        enableSorting: true,
        header: "Uploaded on",
        cell: ({ row }) => {
          try {
            return formatUtcDatetime(row.original.created);
          } catch {
            return "Never";
          }
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        enableSorting: false,
        header: Labels.Actions,
        cell: ({ row }) => (
          <TableActions
            deleteDisabled={row.original.default}
            deleteTooltip={
              row.original.default ? "Default scripts cannot be deleted." : null
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
    [openSidePanel]
  );
};

export default useScriptsTableColumns;
