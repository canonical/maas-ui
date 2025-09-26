import { type Dispatch, type SetStateAction, useMemo } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import type {
  Column,
  ColumnDef,
  Getter,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import pluralize from "pluralize";

import DeleteImages from "../../DeleteImages";

import DoubleRow from "@/app/base/components/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { Image } from "@/app/images/types";
import { formatUtcDatetime, getTimeDistanceString } from "@/app/utils/time";

export type ImageColumnDef = ColumnDef<Image, Partial<Image>>;

export const filterCells = (
  row: Row<Image>,
  column: Column<Image>
): boolean => {
  if (row.getIsGrouped()) {
    return ["name", "actions"].includes(column.id);
  } else {
    return !["name"].includes(column.id);
  }
};

export const filterHeaders = (header: Header<Image, unknown>): boolean =>
  header.column.id !== "name";

const useImageTableColumns = ({
  commissioningRelease,
  selectedRows,
  setSelectedRows,
}: {
  commissioningRelease: string | null;
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
}): ImageColumnDef[] => {
  const { openSidePanel } = useSidePanel();
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          cell: ({
            row,
            getValue,
          }: {
            row: Row<Image>;
            getValue: Getter<Image["name"]>;
          }) => {
            return (
              <div>
                <div>
                  <strong>{getValue()}</strong>
                </div>
                <small className="u-text--muted">
                  {pluralize("image", row.getLeafRows().length ?? 0, true)}
                </small>
              </div>
            );
          },
        },
        {
          id: "release",
          accessorKey: "release",
          enableSorting: true,
          header: () => "Release title",
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
        },
        {
          id: "canDeployToMemory",
          accessorKey: "canDeployToMemory",
          enableSorting: true,
          header: () => "Deployable in Memory",
          cell: ({ row: { original: canDeployToMemory } }) =>
            canDeployToMemory ? (
              <TooltipButton
                iconName="task-outstanding"
                iconProps={{ "aria-label": "supported" }}
                message="This image can be deployed in memory."
              />
            ) : (
              <TooltipButton
                iconName="close"
                iconProps={{ "aria-label": "not supported" }}
                message="This image cannot be deployed in memory."
              />
            ),
        },
        {
          id: "status",
          accessorKey: "status",
          enableSorting: true,
          header: () => "Status",
          cell: ({
            row: {
              original: { status, lastSynced },
            },
          }) => {
            let statusIcon;
            switch (status) {
              case "Synced":
                statusIcon = <Icon aria-label={"synced"} name={"success"} />;
                break;
              default:
                statusIcon = <Spinner />;
                break;
            }
            return (
              <DoubleRow
                data-testid="resource-status"
                icon={statusIcon}
                primary={status}
                secondary={lastSynced ?? ""}
              />
            );
          },
        },
        {
          id: "lastDeployed",
          accessorKey: "lastDeployed",
          enableSorting: true,
          header: () => "Last deployed",
          cell: ({
            row: {
              original: { lastDeployed },
            },
          }) => {
            return lastDeployed ? (
              <DoubleRow
                primary={getTimeDistanceString(lastDeployed)}
                secondary={formatUtcDatetime(lastDeployed)}
              />
            ) : (
              "—"
            );
          },
        },
        {
          id: "machines",
          accessorKey: "machines",
          enableSorting: true,
          header: () => "Machines",
          cell: ({ row }) => {
            return row.original.machines || "—";
          },
        },
        {
          id: "actions",
          accessorKey: "id",
          enableSorting: false,
          header: () => "Actions",
          cell: ({ row }: { row: Row<Image> }) => {
            const isCommissioningImage =
              row.original.resource.name === `ubuntu/${commissioningRelease}`;
            const canBeDeleted =
              !isCommissioningImage &&
              (row.original.resource.complete ||
                !row.original.resource.downloading);
            return row.getIsGrouped() ? null : (
              <TableActions
                data-testid="image-actions"
                deleteDisabled={!canBeDeleted}
                deleteTooltip={
                  !canBeDeleted
                    ? isCommissioningImage
                      ? "Cannot delete images of the default commissioning release."
                      : "Cannot delete images that are currently being imported."
                    : "Deletes this image."
                }
                onDelete={() => {
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
              />
            );
          },
        },
      ] as ImageColumnDef[],
    [commissioningRelease, selectedRows, setSelectedRows, openSidePanel]
  );
};

export default useImageTableColumns;
