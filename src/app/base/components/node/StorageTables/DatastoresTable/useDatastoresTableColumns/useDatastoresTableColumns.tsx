import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import type { DatastoreRow } from "@/app/base/components/node/StorageTables/DatastoresTable/DatastoresTable";
import { DatastoreAction } from "@/app/base/components/node/StorageTables/DatastoresTable/DatastoresTable";
import { useSidePanel } from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import { formatSize } from "@/app/store/utils";

export type DatastoresColumnDef = ColumnDef<
  DatastoreRow,
  Partial<DatastoreRow>
>;

const useDatastoresTableColumns = (
  canEditStorage: boolean,
  isMachine: boolean
): DatastoresColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          enableSorting: true,
          header: "Name",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: true,
          header: "Size",
          cell: ({
            row: {
              original: { size },
            },
          }: {
            row: Row<DatastoreRow>;
          }) => formatSize(size),
        },
        {
          id: "fstype",
          accessorKey: "fstype",
          enableSorting: true,
          header: "Filesystem",
        },
        {
          id: "mountPoint",
          accessorKey: "mount_point",
          enableSorting: true,
          header: "Mount point",
        },
        ...(isMachine
          ? [
              {
                id: "Actions",
                accessorKey: "id",
                enableSorting: false,
                header: "Actions",
                cell: ({
                  row: {
                    original: { disk, systemId },
                  },
                }: {
                  row: Row<DatastoreRow>;
                }) => (
                  <TableActionsDropdown
                    actions={[
                      {
                        label: "Remove datastore...",
                        type: DatastoreAction.DELETE,
                      },
                    ]}
                    disabled={!canEditStorage}
                    onActionClick={() => {
                      setSidePanelContent({
                        view: MachineSidePanelViews.REMOVE_DATASTORE,
                        extras: { disk, systemId: systemId },
                      });
                    }}
                  />
                ),
              },
            ]
          : []),
      ] as DatastoresColumnDef[],
    [canEditStorage, isMachine, setSidePanelContent]
  );
};

export default useDatastoresTableColumns;
