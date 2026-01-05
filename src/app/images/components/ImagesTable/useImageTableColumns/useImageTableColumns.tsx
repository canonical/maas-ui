import { type Dispatch, type SetStateAction, useMemo } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import type {
  Column,
  ColumnDef,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import pluralize from "pluralize";

import DeleteImages from "../../DeleteImages";

import DoubleRow from "@/app/base/components/DoubleRow/DoubleRow";
import TableActions from "@/app/base/components/TableActions";
import { useSidePanel } from "@/app/base/side-panel-context-new";
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
          id: "os",
          accessorKey: "os",
          cell: ({ row }: { row: Row<Image> }) => {
            return (
              <div>
                <div>
                  <strong>{row.original.os}</strong>
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
          id: "status",
          accessorKey: "status",
          enableSorting: true,
          header: () => "Status",
          cell: ({
            row: {
              original: { status, sync_percentage },
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
              case "Downloading":
                icon = <Spinner aria-label={"downloading"} />;
            }
            return (
              <DoubleRow
                icon={icon}
                primary={`${status}${status === "Downloading" ? ` ${sync_percentage}%` : ""}`}
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
            const canBeDeleted =
              !isCommissioningImage && row.original.status === "Ready";
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
