import { useMemo } from "react";

import { Icon } from "@canonical/react-components";
import type { ColumnDef } from "@tanstack/react-table";

import DoubleRow from "@/app/base/components/DoubleRow";
import Placeholder from "@/app/base/components/Placeholder";
import DiskNumaNodes from "@/app/base/components/node/DiskNumaNodes";
import type { Disk } from "@/app/store/types/node";

export type CloneStorage = {
  id: string;
  name: string;
  model: string;
  firmwareVersion: string;
  type: string;
  numaNodesDisk: Disk;
  size: string;
  available: boolean;
  availableTestId: "disk-available" | "partition-available";
};

export type CloneStorageColumnDef = ColumnDef<
  CloneStorage,
  Partial<CloneStorage>
>;

const useCloneStorageTableColumns = (
  isLoading?: boolean
): CloneStorageColumnDef[] => {
  return useMemo(
    (): CloneStorageColumnDef[] => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: false,
        header: () => <span className="name-col">Name</span>,
        cell: ({
          row: {
            original: { name },
          },
        }) =>
          isLoading ? (
            <Placeholder>Disk name</Placeholder>
          ) : (
            <DoubleRow primary={name} primaryTitle={name} />
          ),
      },
      {
        id: "model",
        accessorKey: "model",
        enableSorting: false,
        header: () => (
          <span className="model-col">
            <div>Model</div>
            <div>Firmware</div>
          </span>
        ),
        cell: ({
          row: {
            original: { model, firmwareVersion },
          },
        }) =>
          isLoading ? (
            <DoubleRow
              primary={<Placeholder>Model</Placeholder>}
              secondary={<Placeholder>1.0.0</Placeholder>}
            />
          ) : (
            <DoubleRow
              primary={model}
              primaryTitle={model}
              secondary={firmwareVersion}
              secondaryTitle={firmwareVersion}
            />
          ),
      },
      {
        id: "type",
        accessorKey: "type",
        enableSorting: false,
        header: () => (
          <span className="type-col">
            <div>Type</div>
            <div>NUMA node</div>
          </span>
        ),
        cell: ({
          row: {
            original: { type, numaNodesDisk },
          },
        }) =>
          isLoading ? (
            <DoubleRow
              primary={<Placeholder>Disk type</Placeholder>}
              secondary={<Placeholder>X, X</Placeholder>}
            />
          ) : (
            <DoubleRow
              primary={type}
              primaryTitle={type}
              secondary={<DiskNumaNodes disk={numaNodesDisk} />}
            />
          ),
      },
      {
        id: "size",
        accessorKey: "size",
        enableSorting: false,
        header: () => <span className="size-col">Size</span>,
        cell: ({
          row: {
            original: { size },
          },
        }) => (isLoading ? <Placeholder>1.23 GB</Placeholder> : <>{size}</>),
      },
      {
        id: "available",
        accessorKey: "available",
        enableSorting: false,
        header: () => (
          <span className="available-col u-align--center">Available</span>
        ),
        cell: ({
          row: {
            original: { available, availableTestId },
          },
        }) =>
          isLoading ? (
            <Placeholder>Icon</Placeholder>
          ) : (
            <Icon
              aria-label={available ? "available" : "not available"}
              data-testid={availableTestId}
              name={available ? "tick" : "close"}
            />
          ),
      },
    ],
    [isLoading]
  );
};

export default useCloneStorageTableColumns;
