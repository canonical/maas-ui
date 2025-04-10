import type { ColumnDef, Row } from "@tanstack/react-table";
import { Link } from "react-router";

import type { ZoneWithSummaryResponse } from "@/app/apiclient";
import TableActions from "@/app/base/components/TableActions";
import urls from "@/app/base/urls";
import { FilterDevices } from "@/app/store/device/utils";
import { FilterMachines } from "@/app/store/machine/utils";

export type ZoneColumnDef = ColumnDef<
  ZoneWithSummaryResponse,
  Partial<ZoneWithSummaryResponse>
>;

const filterDevices = (name: string) =>
  FilterDevices.filtersToQueryString({
    zone: [name],
  });

const machinesFilter = (name: string) =>
  FilterMachines.filtersToQueryString({
    zone: [name],
  });

const useZonesTableColumns = ({
  isAdmin,
  onEdit,
  onDelete,
}: {
  isAdmin: boolean;
  onEdit: (row: Row<ZoneWithSummaryResponse>) => void;
  onDelete: (row: Row<ZoneWithSummaryResponse>) => void;
}): ZoneColumnDef[] => {
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: "Name",
    },
    {
      id: "description",
      accessorKey: "description",
      enableSorting: true,
      header: "Description",
    },
    {
      id: "machines_count",
      accessorKey: "machines_count",
      enableSorting: true,
      header: "Machines",
      cell: ({ row }) => {
        return (
          <Link
            className="u-align--right"
            to={`${urls.machines.index}${machinesFilter(row.original.name)}`}
          >
            {row.original.machines_count}
          </Link>
        );
      },
    },
    {
      id: "devices_count",
      accessorKey: "devices_count",
      enableSorting: true,
      header: "Devices",
      cell: ({ row }) => {
        return (
          <Link
            className="u-align--right"
            to={`${urls.devices.index}${filterDevices(row.original.name)}`}
          >
            {row.original.devices_count}
          </Link>
        );
      },
    },
    {
      id: "controllers_count",
      accessorKey: "controllers_count",
      enableSorting: true,
      header: "Controllers",
      cell: ({ row }) => {
        return (
          <Link className="u-align--right" to={`${urls.controllers.index}`}>
            {row.original.controllers_count}
          </Link>
        );
      },
    },
    {
      id: "action",
      accessorKey: "id",
      enableSorting: false,
      header: "Action",
      cell: ({ row }: { row: Row<ZoneWithSummaryResponse> }) => {
        const canBeDeleted = isAdmin && row.original.id !== 1;
        return (
          <TableActions
            data-testid="zone-actions"
            deleteDisabled={!canBeDeleted}
            deleteTooltip={
              !canBeDeleted ? "Cannot delete the default zone." : null
            }
            onDelete={() => {
              onDelete(row);
            }}
            onEdit={() => {
              onEdit(row);
            }}
          />
        );
      },
    },
  ];
};

export default useZonesTableColumns;
