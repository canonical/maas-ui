import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import urls from "@/app/base/urls";
import { FilterDevices } from "@/app/store/device/utils";
import { FilterMachines } from "@/app/store/machine/utils";
import type { Zone } from "@/app/store/zone/types";

export type ZoneColumnDef = ColumnDef<Zone, Partial<Zone>>;

const filterDevices = (name: string) =>
  FilterDevices.filtersToQueryString({
    zone: [name],
  });

const machinesFilter = (name: string) =>
  FilterMachines.filtersToQueryString({
    zone: [name],
  });

const useZonesTableColumns = (): ZoneColumnDef[] => {
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link to={`${urls.zones.details({ id: row.original.id })}`}>
            {row.original.name}
          </Link>
        );
      },
    },
    {
      id: "description",
      accessorKey: "description",
      enableSorting: true,
      header: "Description",
    },
    {
      id: "machines",
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
      id: "devices",
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
      id: "controllers",
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
  ];
};

export default useZonesTableColumns;
