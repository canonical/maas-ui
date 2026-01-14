import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import type { Disk, Partition } from "@/app/store/types/node";
import { formatSize, formatType } from "@/app/store/utils";

export type CreateVolumeGroupColumnData = Disk | Partition;

export type CreateVolumeGroupColumnDef = ColumnDef<
  CreateVolumeGroupColumnData,
  Partial<CreateVolumeGroupColumnData>
>;

const useCreateVolumeGroupColumns = (): CreateVolumeGroupColumnDef[] => {
  return useMemo(
    (): CreateVolumeGroupColumnDef[] => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: false,
      },
      {
        accessorKey: "size",
        header: "Size",
        enableSorting: false,
        cell: ({
          row: {
            original: { size },
          },
        }) => formatSize(size),
      },
      {
        accessorKey: "type",
        header: "Device Type",
        enableSorting: false,
        cell: ({ row: { original } }) => formatType(original),
      },
    ],
    []
  );
};

export default useCreateVolumeGroupColumns;
