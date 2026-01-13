import { type Dispatch, type SetStateAction, useMemo } from "react";

import { Button, Icon, Spinner, Tooltip } from "@canonical/react-components";
import type {
  Column,
  ColumnDef,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import pluralize from "pluralize";

import { useStartImageSync, useStopImageSync } from "@/app/api/query/imageSync";
import DoubleRow from "@/app/base/components/DoubleRow/DoubleRow";
import { useSidePanel } from "@/app/base/side-panel-context";
import DeleteImages from "@/app/images/components/DeleteImages";
import type { Image } from "@/app/images/types";

export type ImageColumnDef = ColumnDef<Image, Partial<Image>>;

export const filterCells = (
  row: Row<Image>,
  column: Column<Image>
): boolean => {
  if (row.getIsGrouped()) {
    return ["os", "actions"].includes(column.id);
  } else {
    return !["os"].includes(column.id);
  }
};

export const filterHeaders = (header: Header<Image, unknown>): boolean =>
  header.column.id !== "os";

const useImageTableColumns = ({
  commissioningRelease,
  selectedRows,
  setSelectedRows,
  isStatusLoading,
  isStatisticsLoading,
}: {
  commissioningRelease: string;
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
  isStatusLoading: boolean;
  isStatisticsLoading: boolean;
}): ImageColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  const startSync = useStartImageSync();
  const stopSync = useStopImageSync();

  return useMemo(
    () =>
      [
        {
          id: "os",
          accessorKey: "os",
          cell: ({ row }: { row: Row<Image> }) => {
            return (
              <div>
                <div>
                  <strong>
                    {row.original.os.charAt(0).toUpperCase() +
                      row.original.os.slice(1)}
                  </strong>
                </div>
                <small className="u-text--muted">
                  {pluralize("image", row.getLeafRows().length ?? 0, true)}
                </small>
              </div>
            );
          },
        },
        {
          id: "title",
          accessorKey: "title",
          enableSorting: true,
          header: () => "Release title",
          cell: ({
            row: {
              original: { release, title },
            },
          }: {
            row: Row<Image>;
          }) => {
            return (
              <div>
                <div>{title}</div>
                <small className="u-text--muted">{release}</small>
              </div>
            );
          },
        },
        {
          id: "architecture",
          accessorKey: "architecture",
          enableSorting: true,
          header: () => "Architecture",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: true,
          header: () => "Size",
          cell: ({
            row: {
              original: { size },
            },
          }) => (isStatisticsLoading ? <Spinner /> : size ? size : "—"),
        },
        {
          id: "version",
          accessorKey: "version",
          enableSorting: true,
          header: () => "Version",
          cell: ({
            row: {
              original: { update_status, last_updated, sync_percentage },
            },
          }) => {
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                primary={
                  update_status === "Downloading" ||
                  update_status === "Optimistic" ? (
                    <>
                      <div className="p-progress">
                        <div
                          className="p-progress__value"
                          style={{ width: `${sync_percentage}%` }}
                        />
                      </div>
                      <small className="u-text--muted">
                        {sync_percentage}%
                      </small>
                    </>
                  ) : (
                    update_status
                  )
                }
                secondary={
                  isStatisticsLoading ? (
                    <Spinner />
                  ) : last_updated ? (
                    `Last updated on ${new Date(last_updated ?? "").toLocaleDateString()}`
                  ) : (
                    "—"
                  )
                }
              />
            );
          },
        },
        {
          id: "status",
          accessorKey: "status",
          enableSorting: true,
          header: () => "Status",
          cell: ({
            row: {
              original: { status, sync_percentage, node_count },
            },
          }) => {
            let icon;
            switch (status) {
              case "Ready":
                icon = <Icon aria-label={"synced"} name={"success"} />;
                break;
              case "Waiting for download":
                icon = <Icon name={"status-waiting"} />;
                break;
              case "Optimistic":
              case "Downloading":
                icon = null;
            }
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                icon={icon}
                primary={
                  status === "Downloading" || status === "Optimistic" ? (
                    <>
                      <div className="p-progress">
                        <div
                          className="p-progress__value"
                          style={{ width: `${sync_percentage}%` }}
                        />
                      </div>
                      <small className="u-text--muted">
                        {sync_percentage}%
                      </small>
                    </>
                  ) : (
                    status
                  )
                }
                secondary={
                  isStatisticsLoading ? (
                    <Spinner />
                  ) : typeof node_count === "number" ? (
                    pluralize("node", node_count, true)
                  ) : (
                    "—"
                  )
                }
              />
            );
          },
        },
        {
          id: "actions",
          accessorKey: "id",
          enableSorting: false,
          header: () => "Actions",
          cell: ({ row }: { row: Row<Image> }) => {
            const isCommissioningImage =
              row.original.release === commissioningRelease;
            const isSyncing =
              row.original.status === "Downloading" ||
              row.original.status === "Optimistic";
            const isUpdating =
              row.original.update_status === "Downloading" ||
              row.original.update_status === "Optimistic";
            const downloadInProgress = isSyncing || isUpdating;
            const canBeDeleted = !isCommissioningImage && !downloadInProgress;
            return row.getIsGrouped() ? null : (
              <div>
                {downloadInProgress ? (
                  <Tooltip
                    message="Stop image synchronization."
                    position="left"
                  >
                    <Button
                      appearance="base"
                      className="is-dense u-table-cell-padding-overlap"
                      disabled={startSync.isPending}
                      hasIcon
                      onClick={() => {
                        stopSync.mutate({
                          path: {
                            id: row.original.id,
                            boot_source_id: row.original.boot_source_id!,
                          },
                        });
                      }}
                    >
                      <i className="p-icon--stop">Stop synchronization</i>
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    message={
                      row.original.status === "Waiting for download" ||
                      row.original.update_status === "Update available"
                        ? "Start image synchronization."
                        : "Image is already synchronized."
                    }
                    position="left"
                  >
                    <Button
                      appearance="base"
                      className="is-dense u-table-cell-padding-overlap"
                      disabled={stopSync.isPending}
                      hasIcon
                      onClick={() => {
                        startSync.mutate({
                          path: {
                            id: row.original.id,
                            boot_source_id: row.original.boot_source_id!,
                          },
                        });
                      }}
                    >
                      <i className="p-icon--begin-downloading">
                        Start synchronization
                      </i>
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  message={
                    !canBeDeleted
                      ? isCommissioningImage
                        ? "Cannot delete images of the default commissioning release."
                        : "Cannot delete images that are currently being imported."
                      : "Delete this image."
                  }
                  position="left"
                >
                  <Button
                    appearance="base"
                    className="is-dense u-table-cell-padding-overlap"
                    disabled={!canBeDeleted}
                    hasIcon
                    onClick={() => {
                      if (row.original.id) {
                        if (!row.getIsSelected()) {
                          row.toggleSelected();
                        }
                        openSidePanel({
                          component: DeleteImages,
                          title: "Delete images",
                          props: {
                            rowSelection: { ...selectedRows, [row.id]: true },
                            setRowSelection: setSelectedRows,
                          },
                        });
                      }
                    }}
                  >
                    <i className="p-icon--delete">Delete</i>
                  </Button>
                </Tooltip>
              </div>
            );
          },
        },
      ] as ImageColumnDef[],
    [
      isStatisticsLoading,
      isStatusLoading,
      stopSync,
      startSync,
      commissioningRelease,
      openSidePanel,
      selectedRows,
      setSelectedRows,
    ]
  );
};

export default useImageTableColumns;
