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
import { OPERATING_SYSTEM_NAMES } from "@/app/images/constants";
import type { Image } from "@/app/images/types";

export type ImageColumnDef = ColumnDef<Image, Partial<Image>>;

const TOOLTIP_MESSAGES = {
  STOP_SYNC_ACTIVE: "Stop image synchronization.",
  STOP_SYNC_OPTIMISTIC: "Synchronization cannot be stopped while queueing.",
  START_SYNC: "Start image synchronization.",
  START_SYNC_DISABLED: "Image is already synchronized.",
  DELETE_IMAGE: "Delete this image.",
  DELETE_COMMISSIONING:
    "Cannot delete images of the default commissioning release.",
  DELETE_IMPORTING: "Cannot delete images that are currently being downloaded.",
} as const;

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
                    {OPERATING_SYSTEM_NAMES.find(
                      (os) =>
                        os.value.toLowerCase() === row.original.os.toLowerCase()
                    )?.label ??
                      row.original.os.charAt(0).toUpperCase() +
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
                {title !== release ? (
                  <small className="u-text--muted">{release}</small>
                ) : null}
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
          }) =>
            isStatisticsLoading ? (
              <Spinner />
            ) : size && size !== "0 bytes" ? (
              size
            ) : (
              "—"
            ),
        },
        {
          id: "version",
          accessorKey: "version",
          enableSorting: true,
          header: () => (
            <>
              <span>Version</span>
              <br />
              <span>Last update</span>
            </>
          ),
          cell: ({
            row: {
              original: {
                update_status,
                last_updated,
                sync_percentage,
                isUpstream,
              },
            },
          }) => {
            const isOptimistic = update_status === "Optimistic";
            const isStopping = update_status === "Stopping";
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                primary={
                  isUpstream ? (
                    update_status === "Downloading" ||
                    update_status === "Optimistic" ||
                    update_status === "Stopping" ? (
                      <>
                        {!isStopping ? (
                          <div className="p-progress">
                            <div
                              className="p-progress__value"
                              style={{
                                width: `${isOptimistic ? 100 : isStopping ? 0 : sync_percentage}%`,
                              }}
                            />
                          </div>
                        ) : null}
                        <small className="u-text--muted">
                          {isOptimistic
                            ? "Queueing..."
                            : isStopping
                              ? "Stopping..."
                              : `${sync_percentage}%`}
                        </small>
                      </>
                    ) : update_status === "No updates available" ? (
                      "Up to date"
                    ) : (
                      update_status
                    )
                  ) : (
                    <Tooltip
                      message="This image is not managed by an upstream source."
                      position="right"
                    >
                      Custom
                      <Icon name="information" />
                    </Tooltip>
                  )
                }
                secondary={
                  isStatisticsLoading ? (
                    <Spinner />
                  ) : last_updated ? (
                    `Last updated on ${new Date(last_updated).toLocaleDateString()}`
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
          header: () => (
            <>
              <span>Status</span>
              <br />
              <span>Machines</span>
            </>
          ),
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
            const isOptimistic = status === "Optimistic";
            const isStopping = status === "Stopping";
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                icon={icon}
                primary={
                  status === "Downloading" ||
                  status === "Optimistic" ||
                  status === "Stopping" ? (
                    <>
                      {!isStopping ? (
                        <div className="p-progress">
                          <div
                            className="p-progress__value"
                            style={{
                              width: `${isOptimistic ? 100 : sync_percentage}%`,
                            }}
                          />
                        </div>
                      ) : null}
                      <small className="u-text--muted">
                        {isOptimistic
                          ? "Queueing..."
                          : isStopping
                            ? "Stopping..."
                            : `${sync_percentage}%`}
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
                    pluralize("machine", node_count, true)
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
          cell: ({
            row: {
              id: rowId,
              getIsSelected,
              getIsGrouped,
              toggleSelected,
              original: { id, boot_source_id, release, status, update_status },
            },
          }: {
            row: Row<Image>;
          }) => {
            const isCommissioningImage = release === commissioningRelease;

            const isSyncing =
              status === "Downloading" || status === "Optimistic";
            const isUpdating =
              update_status === "Downloading" || update_status === "Optimistic";

            const isOptimistic =
              status === "Optimistic" || update_status === "Optimistic";

            const isStopping =
              status === "Stopping" || update_status === "Stopping";

            const downloadInProgress = isSyncing || isUpdating || isStopping;

            const downloadAvailable =
              status === "Waiting for download" ||
              update_status === "Update available";

            const canBeDeleted = !isCommissioningImage && !downloadInProgress;
            const isCustom = id.endsWith("-custom");
            const imageId = Number(id.split("-")[0]);

            return getIsGrouped() ? null : (
              <div>
                {isCustom ? null : downloadInProgress ? (
                  <Tooltip
                    message={
                      !isOptimistic
                        ? TOOLTIP_MESSAGES.STOP_SYNC_ACTIVE
                        : TOOLTIP_MESSAGES.STOP_SYNC_OPTIMISTIC
                    }
                    position="left"
                  >
                    <Button
                      appearance="base"
                      className="is-dense u-table-cell-padding-overlap"
                      disabled={startSync.isPending || isOptimistic || isCustom}
                      hasIcon
                      onClick={() => {
                        stopSync.mutate({
                          path: {
                            id: imageId,
                            boot_source_id: boot_source_id!,
                          },
                        });
                      }}
                    >
                      <Icon name="stop">Stop synchronization</Icon>
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    message={
                      downloadAvailable
                        ? TOOLTIP_MESSAGES.START_SYNC
                        : TOOLTIP_MESSAGES.START_SYNC_DISABLED
                    }
                    position="left"
                  >
                    <Button
                      appearance="base"
                      className="is-dense u-table-cell-padding-overlap"
                      disabled={
                        !downloadAvailable ||
                        stopSync.isPending ||
                        isStopping ||
                        isCustom
                      }
                      hasIcon
                      onClick={() => {
                        startSync.mutate({
                          path: {
                            id: imageId,
                            boot_source_id: boot_source_id!,
                          },
                        });
                      }}
                    >
                      <Icon name="begin-downloading">
                        Start synchronization
                      </Icon>
                    </Button>
                  </Tooltip>
                )}
                <Tooltip
                  message={
                    !canBeDeleted
                      ? isCommissioningImage
                        ? TOOLTIP_MESSAGES.DELETE_COMMISSIONING
                        : TOOLTIP_MESSAGES.DELETE_IMPORTING
                      : TOOLTIP_MESSAGES.DELETE_IMAGE
                  }
                  position="left"
                >
                  <Button
                    appearance="base"
                    className="is-dense u-table-cell-padding-overlap"
                    disabled={!canBeDeleted}
                    hasIcon
                    onClick={() => {
                      if (id) {
                        if (!getIsSelected()) {
                          toggleSelected();
                        }
                        openSidePanel({
                          component: DeleteImages,
                          title: "Delete images",
                          props: {
                            rowSelection: { ...selectedRows, [rowId]: true },
                            setRowSelection: setSelectedRows,
                          },
                        });
                      }
                    }}
                  >
                    <Icon name="delete">Delete</Icon>
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
