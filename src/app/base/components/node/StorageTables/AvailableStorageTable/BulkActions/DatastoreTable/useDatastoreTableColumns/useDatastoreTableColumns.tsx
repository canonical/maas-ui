import { useMemo } from "react";

import { Icon, Input } from "@canonical/react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";

import type { Disk, Partition } from "@/app/store/types/node";
import { formatSize, formatType, isDisk } from "@/app/store/utils";

export type DatastoreColumnDef = ColumnDef<
  Disk | Partition,
  Partial<Disk | Partition>
>;

const useDatastoreTableColumns = ({
  maxSpares,
  spareBlockDeviceIds,
  sparePartitionIds,
  handleSpareCheckbox,
}: {
  maxSpares: number;
  spareBlockDeviceIds?: number[];
  sparePartitionIds?: number[];
  handleSpareCheckbox?: (
    storageDevice: Disk | Partition,
    isSpareDevice: boolean
  ) => void;
}): DatastoreColumnDef[] => {
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
        ...(maxSpares > 0
          ? [
              {
                id: "active",
                accessorKey: "active",
                enableSorting: false,
                header: () => "Active",
                cell: ({
                  row: { original: device },
                }: {
                  row: Row<Disk | Partition>;
                }) => {
                  const isSpareDevice = isDisk(device)
                    ? spareBlockDeviceIds?.includes(device.id)
                    : sparePartitionIds?.includes(device.id);
                  return isSpareDevice ? (
                    <Icon data-testid="is-spare" name="close" />
                  ) : (
                    <Icon data-testid="is-active" name="tick" />
                  );
                },
              },
              {
                id: "max-spares",
                accessorKey: "max-spares",
                enableSorting: false,
                header: () => `Spare (max ${maxSpares})`,
                cell: ({
                  row: { original: device },
                }: {
                  row: Row<Disk | Partition>;
                }) => {
                  const isSpareDevice = isDisk(device)
                    ? spareBlockDeviceIds?.includes(device.id)
                    : sparePartitionIds?.includes(device.id);
                  const numSpare =
                    (spareBlockDeviceIds?.length ?? 0) +
                    (sparePartitionIds?.length ?? 0);
                  return (
                    <Input
                      checked={isSpareDevice}
                      disabled={!isSpareDevice && numSpare >= maxSpares}
                      id={`raid-${device.type}-${device.id}`}
                      label=" "
                      labelClassName="is-inline-label"
                      onChange={() => {
                        if (handleSpareCheckbox) {
                          handleSpareCheckbox(device, !!isSpareDevice);
                        }
                      }}
                      type="checkbox"
                    />
                  );
                },
              },
            ]
          : []),
      ] as DatastoreColumnDef[],
    [handleSpareCheckbox, maxSpares, spareBlockDeviceIds, sparePartitionIds]
  );
};

export default useDatastoreTableColumns;
