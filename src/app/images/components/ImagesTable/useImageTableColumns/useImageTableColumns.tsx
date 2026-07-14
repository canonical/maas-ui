import { type Dispatch, type SetStateAction, useMemo } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import {
  Button,
  Icon,
  Spinner,
  Tooltip,
  useToastNotification,
} from "@canonical/react-components";
import type {
  Column,
  ColumnDef,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import pluralize from "pluralize";

import { useImageSources } from "@/app/api/query/imageSources";
import { useStartImageSync, useStopImageSync } from "@/app/api/query/imageSync";
import {
  useAddSelections,
  useAvailableSelections,
  useDeleteSelections,
} from "@/app/api/query/images";
import DoubleRow from "@/app/base/components/DoubleRow/DoubleRow";
import DeleteImages from "@/app/images/components/DeleteImages";
import ImageSourceMenu from "@/app/images/components/ImageSourceMenu";
import ReleaseTitleCell from "@/app/images/components/ReleaseTitleCell";
import type { Image } from "@/app/images/types";
import { buildSourcesByImageKey, getOsDisplayName } from "@/app/images/utils";

export type ImageColumnDef = ColumnDef<Image, Partial<Image>>;

const TOOLTIP_MESSAGES = {
  STOP_SYNC_ACTIVE: "Stop image synchronization.",
  STOP_SYNC_OPTIMISTIC: "Synchronization cannot be stopped while queueing.",
  STOP_SYNC_FAILED: "Stopping image synchronization failed. Please try again.",
  START_SYNC: "Start image synchronization.",
  START_SYNC_DISABLED: "Image is already synchronized.",
  START_SYNC_FAILED: "Starting image synchronization failed. Please try again.",
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
  const { failure } = useToastNotification();
  const startSync = useStartImageSync();
  const stopSync = useStopImageSync();

  const { data: sources, isPending: isSourcesPending } = useImageSources();
  const { data: availableImages, isPending: isAvailableImagesPending } =
    useAvailableSelections();
  const addSelections = useAddSelections();
  const deleteSelections = useDeleteSelections();

  // Pre-compute a map of os/release/arch -> deduplicated BootSourceResponse[]
  const sourcesByImageKey = useMemo(
    () =>
      sources?.items && availableImages?.items
        ? buildSourcesByImageKey(sources.items, availableImages.items)
        : {},
    [sources, availableImages]
  );

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
                  <strong>{getOsDisplayName(row.original.os)}</strong>
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
          }) => <ReleaseTitleCell release={release} title={title} />,
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
            const isOptimistic = update_status === "OptimisticDownloading";
            const isStopping = update_status === "OptimisticStopping";
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                primary={
                  isUpstream ? (
                    update_status === "Downloading" ||
                    update_status === "OptimisticDownloading" ||
                    update_status === "OptimisticStopping" ? (
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
              original: { status, sync_percentage, node_count, selected },
            },
          }) => {
            let icon;
            switch (status) {
              case "Ready":
                icon = <Icon aria-label="synced" name="success" />;
                break;
              case "Waiting for download":
                icon = <Icon name="status-waiting" />;
                break;
              case "OptimisticDownloading":
              case "OptimisticStopping":
              case "Downloading":
                icon = null;
            }
            const isOptimistic = status === "OptimisticDownloading";
            const isStopping = status === "OptimisticStopping";
            return isStatusLoading ? (
              <Spinner />
            ) : (
              <DoubleRow
                icon={selected ? icon : <Icon name="warning" />}
                primary={
                  selected ? (
                    status === "Downloading" ||
                    status === "OptimisticDownloading" ||
                    status === "OptimisticStopping" ? (
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
                  ) : (
                    <Tooltip
                      message="This image release is already selected from a more prioritized source, and will not be synchronized."
                      position="btm-right"
                    >
                      Won't sync
                    </Tooltip>
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
          id: "source",
          accessorKey: "source",
          enableSorting: false,
          header: () => "Source",
          cell: ({
            row: {
              original: {
                id,
                os,
                release,
                architecture,
                boot_source_id,
                isUpstream,
                status,
                update_status,
              },
            },
          }) => {
            if (!isUpstream) {
              return null;
            }

            if (
              isStatusLoading ||
              isSourcesPending ||
              isAvailableImagesPending
            ) {
              return <Spinner text="Loading..." />;
            }

            const key = `${os}/${release}/${architecture}`;
            const switchableSources = sourcesByImageKey[key] ?? [];

            return (
              <ImageSourceMenu
                currentSourceId={boot_source_id}
                disabled={
                  status === "Downloading" ||
                  status === "OptimisticDownloading" ||
                  status === "OptimisticStopping" ||
                  update_status === "Downloading" ||
                  update_status === "OptimisticDownloading" ||
                  update_status === "OptimisticStopping"
                }
                onSourceSelect={(source) => {
                  deleteSelections
                    .mutateAsync({
                      query: { id: [Number.parseInt(id)] },
                    })
                    .then(() => {
                      addSelections.mutate({
                        body: [
                          {
                            os: os,
                            release: release,
                            arch: architecture,
                            boot_source_id: source.id,
                          },
                        ],
                      });
                    });
                }}
                sources={switchableSources}
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
            const isCustom = id.endsWith("-custom");
            const imageId = Number(id.split("-")[0]);

            const isOptimisticDownloading =
              status === "OptimisticDownloading" ||
              update_status === "OptimisticDownloading";
            const isOptimisticStopping =
              status === "OptimisticStopping" ||
              update_status === "OptimisticStopping";
            const isDownloading =
              status === "Downloading" || update_status === "Downloading";

            const downloadInProgress =
              isDownloading || isOptimisticDownloading || isOptimisticStopping;
            const downloadAvailable =
              status === "Waiting for download" ||
              update_status === "Update available";

            const canBeDeleted = !isCommissioningImage && !downloadInProgress;

            const selectedImageCount =
              Object.entries(selectedRows).filter(
                ([selectedRowId, isSelected]) =>
                  selectedRowId !== rowId && isSelected
              ).length + 1;

            return getIsGrouped() ? null : (
              <div>
                {isCustom ? null : downloadInProgress ? (
                  <Tooltip
                    message={
                      !isOptimisticDownloading && !isOptimisticStopping
                        ? TOOLTIP_MESSAGES.STOP_SYNC_ACTIVE
                        : TOOLTIP_MESSAGES.STOP_SYNC_OPTIMISTIC
                    }
                    position="left"
                  >
                    <Button
                      appearance="base"
                      className="is-dense u-table-cell-padding-overlap"
                      disabled={
                        startSync.isPending ||
                        isOptimisticDownloading ||
                        isOptimisticStopping ||
                        isCustom
                      }
                      hasIcon
                      onClick={() => {
                        stopSync
                          .mutateAsync({
                            path: {
                              id: imageId,
                              boot_source_id: boot_source_id!,
                            },
                          })
                          .catch((e: unknown) => {
                            failure(TOOLTIP_MESSAGES.STOP_SYNC_FAILED, e);
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
                        isOptimisticStopping ||
                        isCustom
                      }
                      hasIcon
                      onClick={() => {
                        startSync
                          .mutateAsync({
                            path: {
                              id: imageId,
                              boot_source_id: boot_source_id!,
                            },
                          })
                          .catch((e: unknown) => {
                            failure(TOOLTIP_MESSAGES.START_SYNC_FAILED, e);
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
                          title: `Delete ${selectedImageCount > 1 ? `${selectedImageCount} ` : ""}${pluralize("image", selectedImageCount)}`,
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
      isSourcesPending,
      isAvailableImagesPending,
      sourcesByImageKey,
      deleteSelections,
      addSelections,
      commissioningRelease,
      startSync,
      stopSync,
      failure,
      openSidePanel,
      selectedRows,
      setSelectedRows,
    ]
  );
};

export default useImageTableColumns;
