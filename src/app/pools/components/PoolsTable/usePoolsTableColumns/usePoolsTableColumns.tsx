import { useMemo } from "react";

import type { ColumnDef, Getter, Row } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import type { ResourcePoolWithSummaryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import urls from "@/app/base/urls";
import type { Pool } from "@/app/pools/types";
import { FilterMachines } from "@/app/store/machine/utils";

const getMachinesLabel = (row: ResourcePoolWithSummaryResponse) => {
  if (row.machine_total_count === 0) {
    return "Empty pool";
  }
  const filters = FilterMachines.filtersToQueryString({
    pool: [`=${row.name}`],
  });
  return (
    <Link to={`${urls.machines.index}${filters}`}>
      {`${row.machine_ready_count} of ${row.machine_total_count} ready`}
    </Link>
  );
};

export type PoolsColumnDef = ColumnDef<Pool, Partial<Pool>>;

const usePoolsTableColumns = () => {
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          enableSorting: true,
          header: () => "Name",
        },
        {
          id: "machines",
          accessorKey: "machines",
          enableSorting: true,
          header: () => "Machines",
          cell: ({ getValue }: { getValue: Getter<Pool["machines"]> }) => {
            return getMachinesLabel(getValue());
          },
        },
        {
          id: "description",
          accessorKey: "description",
          enableSorting: true,
          header: () => "Description",
        },
        {
          id: "actions",
          accessorKey: "actions",
          enableSorting: false,
          header: () => "Actions",
          cell: ({ row }: { row: Row<Pool> }) => {
            return (
              <TableActions
                deleteDisabled={
                  !row.original.resource.permissions.includes("delete") ||
                  row.original.resource.is_default ||
                  row.original.resource.machine_total_count > 0
                }
                deletePath={urls.pools.delete({ id: row.original.id })}
                deleteTooltip={
                  (row.original.resource.is_default &&
                    "The default pool may not be deleted.") ||
                  (row.original.resource.machine_total_count > 0 &&
                    "Cannot delete a pool that contains machines.") ||
                  null
                }
                editDisabled={
                  !row.original.resource.permissions.includes("edit")
                }
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
