import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import type { FilesystemRow } from "@/app/base/components/node/StorageTables/FilesystemsTable/FilesystemsTable";
import { FilesystemAction } from "@/app/base/components/node/StorageTables/FilesystemsTable/FilesystemsTable";
import { useSidePanel } from "@/app/base/side-panel-context";
import { MachineSidePanelViews } from "@/app/machines/constants";
import { formatSize, usesStorage } from "@/app/store/utils";

export type FilesystemsColumnDef = ColumnDef<
  FilesystemRow,
  Partial<FilesystemRow>
>;

const useFileSystemsTableColumns = (
  canEditStorage: boolean,
  isMachine: boolean
): FilesystemsColumnDef[] => {
  const { setSidePanelContent } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          enableSorting: false,
          header: "Name",
          cell: ({
            row: {
              original: { name },
            },
          }: {
            row: Row<FilesystemRow>;
          }) => name ?? "—",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: false,
          header: "Size",
          cell: ({
            row: {
              original: { size },
            },
          }: {
            row: Row<FilesystemRow>;
          }) => (size ? formatSize(size) : "—"),
        },
        {
          id: "fstype",
          accessorKey: "fstype",
          enableSorting: false,
          header: "Filesystem",
        },
        {
          id: "mountPoint",
          accessorKey: "mount_point",
          enableSorting: false,
          header: "Mount point",
        },
        {
          id: "mountOptions",
          accessorKey: "mount_options",
          enableSorting: false,
          header: "Mount options",
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
                    original: { fstype, mount_point, node, storage },
                  },
                }: {
                  row: Row<FilesystemRow>;
                }) => (
                  <TableActionsDropdown
                    actions={[
                      {
                        label: "Unmount filesystem...",
                        show: usesStorage(fstype),
                        type: FilesystemAction.UNMOUNT,
                        view: MachineSidePanelViews.UNMOUNT_FILESYSTEM,
                      },
                      {
                        label: "Remove filesystem...",
                        type: FilesystemAction.DELETE,
                        view:
                          node.special_filesystems && !storage
                            ? MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM
                            : MachineSidePanelViews.DELETE_FILESYSTEM,
                      },
                    ]}
                    disabled={!canEditStorage}
                    onActionClick={(_, view) => {
                      if (view) {
                        if (
                          node.special_filesystems &&
                          view ===
                            MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM
                        ) {
                          setSidePanelContent({
                            view,
                            extras: {
                              systemId: node.system_id,
                              mountPoint: mount_point,
                            },
                          });
                          return;
                        }
                        setSidePanelContent({
                          view,
                          extras: {
                            systemId: node.system_id,
                            storageDevice: storage,
                          },
                        });
                      }
                    }}
                  />
                ),
              },
            ]
          : []),
      ] as FilesystemsColumnDef[],
    [canEditStorage, isMachine, setSidePanelContent]
  );
};

export default useFileSystemsTableColumns;
