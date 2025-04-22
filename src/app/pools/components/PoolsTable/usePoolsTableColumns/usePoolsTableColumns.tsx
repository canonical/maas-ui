import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";
import { Link } from "react-router";

import type { ResourcePoolWithSummaryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import urls from "@/app/base/urls";
import { FilterMachines } from "@/app/store/machine/utils";

const getMachinesLabel = (row: Row<ResourcePoolWithSummaryResponse>) => {
  if (row.original.machine_total_count === 0) {
    return "Empty pool";
  }
  const filters = FilterMachines.filtersToQueryString({
    pool: [`=${row.original.name}`],
  });
  return (
    <Link to={`${urls.machines.index}${filters}`}>
      {`${row.original.machine_ready_count} of ${row.original.machine_total_count} ready`}
    </Link>
  );
};

export type PoolsColumnDef = ColumnDef<
  ResourcePoolWithSummaryResponse,
  Partial<ResourcePoolWithSummaryResponse>
>;

const usePoolsTableColumns = () => {
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
          id: "machine_ready_count",
          accessorKey: "machine_ready_count",
          enableSorting: true,
          header: "Machines",
          cell: ({ row }) => {
            return getMachinesLabel(row);
          },
        },
        {
          id: "description",
          accessorKey: "description",
          enableSorting: true,
          header: "Description",
        },
        {
          id: "actions",
          accessorKey: "id",
          enableSorting: false,
          header: "Actions",
          cell: ({ row }) => {
            return (
              <TableActions
                deleteDisabled={
                  !row.original.permissions.includes("delete") ||
                  row.original.is_default ||
                  row.original.machine_total_count > 0
                }
                deletePath={urls.pools.delete({ id: row.original.id })}
                deleteTooltip={
                  (row.original.is_default &&
                    "The default pool may not be deleted.") ||
                  (row.original.machine_total_count > 0 &&
                    "Cannot delete a pool that contains machines.") ||
                  null
                }
                editDisabled={!row.original.permissions.includes("edit")}
                editPath={urls.pools.edit({ id: row.original.id })}
              />
            );
          },
        },
      ] as PoolsColumnDef[],
    []
  );
};

export default usePoolsTableColumns;
