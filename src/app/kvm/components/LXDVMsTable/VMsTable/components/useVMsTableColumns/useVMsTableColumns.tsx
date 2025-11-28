import type { ReactNode } from "react";
import { useMemo } from "react";

import { formatBytes } from "@canonical/maas-react-components";
import type { ColumnDef, Row } from "@tanstack/react-table";

import CoresColumn from "../CoresColumn";
import HugepagesColumn from "../HugepagesColumn";
import IPColumn from "../IPColumn";
import NameColumn from "../NameColumn";
import StatusColumn from "../StatusColumn";

import DoubleRow from "@/app/base/components/DoubleRow";
import type { Machine } from "@/app/store/machine/types";
import type { Tag } from "@/app/store/tag/types";
import { getTagNamesForIds } from "@/app/store/tag/utils";

export enum Label {
  Name = "Name",
  Status = "Status",
  Ipv4 = "Ipv4",
  Ipv6 = "Ipv6",
  Hugepages = "Hugepages",
  Cores = "Cores",
  Ram = "Ram",
  Pool = "Pool",
  EmptyList = "No VMs available",
}

export type GetHostColumn = (vm: Machine) => ReactNode;

export type GetResources = (vm: Machine) => {
  hugepagesBacked: boolean;
  pinnedCores: number[];
  unpinnedCores: number;
};
type Props = {
  callId?: string | null;
  getHostColumn?: GetHostColumn;
  getResources: GetResources;
  tags: Tag[];
};

type VMsColumnDef = ColumnDef<Machine, Partial<Machine>>;

const useVMsTableColumns = ({
  callId,
  getHostColumn,
  getResources,
  tags,
}: Props): VMsColumnDef[] => {
  return useMemo(
    () => [
      {
        id: "fqdn",
        header: "VM name",
        accessorKey: "fqdn",
        enableSorting: true,
        cell: ({ row }) => (
          <NameColumn
            aria-label={Label.Name}
            systemId={row.original.system_id}
          />
        ),
      },
      {
        id: "status",
        header: "STATUS",
        accessorKey: "status",
        enableSorting: true,

        cell: ({ row }) => (
          <StatusColumn
            aria-label={Label.Status}
            systemId={row.original.system_id}
          />
        ),
      },
      ...(getHostColumn
        ? [
            {
              id: "host",
              header: "KVM host",
              accessorKey: "host",
              cell: ({ row }: { row: Row<Machine> }) => (
                <>{getHostColumn?.(row.original)}</>
              ),
            },
          ]
        : []),
      {
        id: "ipv4",
        header: "IPV4",
        accessorKey: "ipv4",
        cell: ({ row }) => (
          <IPColumn
            aria-label={Label.Ipv4}
            systemId={row.original.system_id}
            version={4}
          />
        ),
      },
      {
        id: "ipv6",
        header: "IPV6",
        accessorKey: "ipv6",
        cell: ({ row }) => (
          <IPColumn
            aria-label={Label.Ipv6}
            systemId={row.original.system_id}
            version={6}
          />
        ),
      },
      {
        id: "hugepages",
        header: "HUGEPAGES",
        accessorKey: "hugepages",
        cell: ({ row }) => (
          <HugepagesColumn
            aria-label={Label.Hugepages}
            hugepagesBacked={getResources(row.original).hugepagesBacked}
          />
        ),
      },
      {
        id: "cores",
        header: "CORES",
        accessorKey: "cores",
        cell: ({ row }) => {
          const { pinnedCores, unpinnedCores } = getResources(row.original);
          return (
            <CoresColumn
              aria-label={Label.Cores}
              pinnedCores={pinnedCores}
              unpinnedCores={unpinnedCores}
            />
          );
        },
      },
      {
        id: "ram",
        header: () => (
          <DoubleRow
            primary="RAM"
            primaryTitle="RAM"
            secondary="STORAGE"
            secondaryTitle="STORAGE"
          />
        ),
        accessorKey: "ram",
        enableSorting: true,
        cell: ({ row }) => {
          const memory = formatBytes(
            { value: row.original.memory, unit: "GiB" },
            { binary: true }
          );
          const storage = formatBytes({
            value: row.original.storage,
            unit: "GB",
          });

          return (
            <DoubleRow
              aria-label={Label.Ram}
              primary={
                <>
                  <span>{memory.value} </span>
                  <small className="u-text--muted">{memory.unit}</small>
                </>
              }
              secondary={
                <>
                  <span>{storage.value} </span>
                  <small className="u-text--muted">{storage.unit}</small>
                </>
              }
            />
          );
        },
      },
      {
        id: "pool",
        header: () => (
          <DoubleRow
            primary="POOL"
            primaryTitle="POOL"
            secondary="TAG"
            secondaryTitle="TAG"
          />
        ),
        accessorKey: "pool",
        enableSorting: true,
        cell: ({ row }) => {
          const tagString = getTagNamesForIds(row.original.tags, tags).join(
            ", "
          );
          return (
            <DoubleRow
              aria-label={Label.Pool}
              data-testid="pool-col"
              primary={row.original.pool.name}
              secondary={tagString}
              secondaryTitle={tagString}
            />
          );
        },
      },
    ],
    [getHostColumn, getResources, tags]
  );
};

export default useVMsTableColumns;
