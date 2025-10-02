import { useMemo } from "react";

import type { ColumnDef, Row } from "@tanstack/react-table";

import DoubleRow from "@/app/base/components/DoubleRow";
import TableHeader from "@/app/base/components/TableHeader";
import TagLinks from "@/app/base/components/TagLinks";
import DiskBootStatus from "@/app/base/components/node/DiskBootStatus";
import DiskNumaNodes from "@/app/base/components/node/DiskNumaNodes";
import DiskTestStatus from "@/app/base/components/node/DiskTestStatus";
import type { UsedStorage } from "@/app/base/components/node/StorageTables/UsedStorageTable/UsedStorageTable";
import urls from "@/app/base/urls";
import { FilterControllers } from "@/app/store/controller/utils";
import { FilterMachines } from "@/app/store/machine/utils";
import { formatSize, formatType } from "@/app/store/utils";

export type UsedStorageColumnDef = ColumnDef<UsedStorage, Partial<UsedStorage>>;

const useUsedStorageTableColumns = (
  isMachine: boolean
): UsedStorageColumnDef[] => {
  return useMemo(
    () =>
      [
        {
          id: "name",
          accessorKey: "name",
          enableSorting: true,
          header: () => (
            <div className="p-double-row__header-spacer">
              <TableHeader sortKey="name">Name</TableHeader>
              <TableHeader>Serial</TableHeader>
            </div>
          ),
          cell: ({ row: { original: storage } }: { row: Row<UsedStorage> }) => (
            <DoubleRow
              primary={storage.name}
              secondary={"serial" in storage && storage.serial}
            />
          ),
        },
        {
          id: "model",
          accessorKey: "model",
          enableSorting: true,
          header: () => (
            <div className="p-double-row__header-spacer">
              <TableHeader sortKey="model">Model</TableHeader>
              <TableHeader>Firmware</TableHeader>
            </div>
          ),
          cell: ({ row: { original: storage } }: { row: Row<UsedStorage> }) => (
            <DoubleRow
              primary={"model" in storage ? storage.model : "—"}
              secondary={
                "firmware_version" in storage && storage.firmware_version
              }
            />
          ),
        },
        {
          id: "boot",
          accessorKey: "boot",
          enableSorting: true,
          header: "Boot",
          cell: ({ row: { original: storage } }: { row: Row<UsedStorage> }) =>
            "is_boot" in storage ? <DiskBootStatus disk={storage} /> : "—",
        },
        {
          id: "size",
          accessorKey: "size",
          enableSorting: true,
          header: "Size",
          cell: ({
            row: {
              original: { size },
            },
          }: {
            row: Row<UsedStorage>;
          }) => formatSize(size),
        },
        {
          id: "type",
          accessorKey: "type",
          enableSorting: false,
          header: () => (
            <div className="p-double-row__header-spacer">
              <TableHeader sortKey="type">Type</TableHeader>
              <TableHeader>NUMA node</TableHeader>
            </div>
          ),
          cell: ({ row: { original: storage } }: { row: Row<UsedStorage> }) => (
            <DoubleRow
              data-testid="type"
              primary={formatType(storage)}
              secondary={
                ("numa_node" in storage || "numa_nodes" in storage) && (
                  <DiskNumaNodes disk={storage} />
                )
              }
            />
          ),
        },
        {
          id: "health",
          accessorKey: "health",
          enableSorting: false,
          header: () => (
            <div className="p-double-row__header-spacer">
              <TableHeader sortKey="health">Health</TableHeader>
              <TableHeader>Tags</TableHeader>
            </div>
          ),
          cell: ({ row: { original: storage } }: { row: Row<UsedStorage> }) => (
            <DoubleRow
              data-testid="health"
              primary={
                "test_status" in storage ? (
                  <DiskTestStatus testStatus={storage.test_status} />
                ) : (
                  "—"
                )
              }
              secondary={
                <TagLinks
                  getLinkURL={(tag) => {
                    if (isMachine) {
                      const filter = FilterMachines.filtersToQueryString({
                        storage_tags: [`=${tag}`],
                      });
                      return `${urls.machines.index}${filter}`;
                    }
                    const filter = FilterControllers.filtersToQueryString({
                      storage_tags: [`=${tag}`],
                    });
                    return `${urls.controllers.index}${filter}`;
                  }}
                  tags={storage.tags}
                />
              }
            />
          ),
        },
        {
          id: "used_for",
          accessorKey: "used_for",
          enableSorting: true,
          header: "Used for",
        },
      ] as UsedStorageColumnDef[],
    [isMachine]
  );
};

export default useUsedStorageTableColumns;
