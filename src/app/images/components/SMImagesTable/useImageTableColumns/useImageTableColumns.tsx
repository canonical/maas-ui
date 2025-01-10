import { useMemo } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import type {
  ColumnDef,
  Row,
  Getter,
  Header,
  Column,
} from "@tanstack/react-table";
import pluralize from "pluralize";

import DoubleRow from "@/app/base/components/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
import TooltipButton from "@/app/base/components/TooltipButton";
import GroupRowActions from "@/app/images/components/GenericTable/GroupRowActions";
import TableCheckbox from "@/app/images/components/GenericTable/TableCheckbox";
import type { Image } from "@/app/images/types";

export type ImageColumnDef = ColumnDef<Image, Partial<Image>>;

export const filterCells = (row: Row<Image>, column: Column<Image>) => {
  if (row.getIsGrouped()) {
    return ["select", "name", "action"].includes(column.id);
  } else {
    return column.id !== "name";
  }
};

export const filterHeaders = (header: Header<Image, unknown>) =>
  header.column.id !== "name";

const useImageTableColumns = ({
  commissioningRelease,
  onDelete,
}: {
  commissioningRelease: string | null;
  onDelete: (row: Row<Image>) => void;
}) => {
  return useMemo(
    () =>
      [
        {
          id: "select",
          accessorKey: "id",
          enableSorting: false,
          header: ({ table }) => {
            return <TableCheckbox.All table={table} />;
          },
          cell: ({
            row,
            getValue,
          }: {
            row: Row<Image>;
            getValue: Getter<Image["name"]>;
          }) => {
            return row.getIsGrouped() ? (
              <TableCheckbox.Group aria-label={getValue()} row={row} />
            ) : (
              <TableCheckbox aria-label={getValue()} row={row} />
            );
          },
        },
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
          enableSorting: false,
          header: () => "Architecture",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: false,
          header: () => "Size",
        },
        {
          id: "status",
          accessorKey: "status",
          enableSorting: false,
          header: () => "Status",
          cell: ({ row }) => {
            let statusIcon;
            switch (row.original.status) {
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
                primary={row.original.status}
                secondary={row.original.lastSynced ?? ""}
              />
            );
          },
        },
        {
          id: "canDeployToMemory",
          accessorKey: "canDeployToMemory",
          enableSorting: false,
          header: () => "Deployable",
          cell: ({
            getValue,
          }: {
            getValue: Getter<Image["canDeployToMemory"]>;
          }) =>
            getValue() ? (
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
          id: "action",
          accessorKey: "id",
          enableSorting: false,
          header: () => "Action",
          cell: ({ row }: { row: Row<Image> }) => {
            const isCommissioningImage =
              row.original.resource.name === `ubuntu/${commissioningRelease}`;
            const canBeDeleted =
              !isCommissioningImage &&
              (row.original.resource.complete ||
                !row.original.resource.downloading);
            return row.getIsGrouped() ? (
              <GroupRowActions row={row} />
            ) : (
              <TableActions
                data-testid="image-actions"
                deleteDisabled={!canBeDeleted}
                deleteTooltip={
                  !canBeDeleted
                    ? isCommissioningImage
                      ? "Cannot delete images of the default commissioning release."
                      : "Cannot delete images that are currently being imported."
                    : null
                }
                onDelete={() => onDelete(row)}
              />
            );
          },
        },
      ] as ImageColumnDef[],
    [commissioningRelease, onDelete]
  );
};

export default useImageTableColumns;
