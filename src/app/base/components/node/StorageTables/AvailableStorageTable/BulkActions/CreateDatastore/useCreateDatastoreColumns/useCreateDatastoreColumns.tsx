import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import type { Disk, Partition } from "@/app/store/types/node";
import { formatSize, formatType } from "@/app/store/utils";

export type DatastoreColumnDef = ColumnDef<
  Disk | Partition,
  Partial<Disk | Partition>
>;

const useCreateDatastoreColumns = (): DatastoreColumnDef[] => {
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          enableSorting: false,
          header: () => "Name",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: false,
          header: () => "Size",
          cell: ({
            row: {
              original: { size },
            },
          }: {
            row: Row<Disk | Partition>;
          }) => formatSize(size),
        },
        {
          id: "type",
          accessorKey: "type",
          enableSorting: false,
          header: () => "Device type",
          cell: ({
            row: { original: device },
          }: {
            row: Row<Disk | Partition>;
          }) => formatType(device),
        },
      ] as DatastoreColumnDef[],
    []
  );
};

export default useCreateDatastoreColumns;
