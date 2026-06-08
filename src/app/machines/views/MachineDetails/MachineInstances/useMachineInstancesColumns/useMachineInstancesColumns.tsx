import { useMemo } from "react";

import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import pluralize from "pluralize";

import type { MachineInstance } from "@/app/machines/views/MachineDetails/MachineInstances/MachineInstances";

export type MachineInstanceColumnDef = ColumnDef<
  MachineInstance,
  Partial<MachineInstance>
>;

export const filterCells = (
  row: Row<MachineInstance>,
  column: Column<MachineInstance>
): boolean => {
  if (row.getIsGrouped()) return column.id === "name";
  return row.original.interfaceCount > 0;
};

const useMachineInstancesColumns = (): MachineInstanceColumnDef[] => {
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          header: "",
          cell: ({ row }: { row: Row<MachineInstance> }) => {
            if (!row.getIsGrouped()) {
              return null;
            }
            const interfaceCount =
              row.getLeafRows()[0]?.original.interfaceCount ?? 0;
            return (
              <div>
                <strong>{row.original.name}</strong>
                <br />
                <small className="u-text--muted">
                  {pluralize("interface", interfaceCount, true)}
                </small>
              </div>
            );
          },
        },
        {
          id: "mac",
          accessorKey: "mac",
          enableSorting: false,
          header: "MAC Address",
        },
        {
          id: "ip",
          accessorKey: "ip",
          enableSorting: false,
          header: "IP Address",
        },
      ] as MachineInstanceColumnDef[],
    []
  );
};

export default useMachineInstancesColumns;
