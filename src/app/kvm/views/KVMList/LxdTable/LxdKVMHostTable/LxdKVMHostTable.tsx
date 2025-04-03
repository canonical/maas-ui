import { Icon, MainTable } from "@canonical/react-components";
import pluralize from "pluralize";

import { useZones } from "@/app/api/query/zones";
import type { ZoneResponse } from "@/app/apiclient";
import DoubleRow from "@/app/base/components/DoubleRow";
import TableHeader from "@/app/base/components/TableHeader";
import { useTableSort } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import CPUColumn from "@/app/kvm/components/CPUColumn";
import NameColumn from "@/app/kvm/components/NameColumn";
import PoolColumn from "@/app/kvm/components/PoolColumn";
import RAMColumn from "@/app/kvm/components/RAMColumn";
import type { Props as RAMColumnProps } from "@/app/kvm/components/RAMColumn/RAMColumn";
import StorageColumn from "@/app/kvm/components/StorageColumn";
import TagsColumn from "@/app/kvm/components/TagsColumn";
import VMsColumn from "@/app/kvm/components/VMsColumn";
import type { KVMResource, KVMStoragePoolResources } from "@/app/kvm/types";
import type { Pod, PodMeta } from "@/app/store/pod/types";
import type { VMCluster, VMClusterMeta } from "@/app/store/vmcluster/types";
import { isComparable } from "@/app/utils";

export enum LxdKVMHostType {
  Cluster = "cluster",
  Single = "single",
}

export type LxdKVMHostTableRow = {
  clusterId?: VMCluster[VMClusterMeta.PK];
  cpuCores: KVMResource;
  cpuOverCommit?: number;
  defaultPoolID?: Pod["default_storage_pool"];
  hostType: LxdKVMHostType;
  hostsCount?: number;
  key: number | string;
  memory: RAMColumnProps["memory"];
  memoryOverCommit?: number;
  name: string;
  podId?: Pod[PodMeta.PK];
  pool?: number | null;
  project?: string;
  storage: KVMResource;
  storagePools: KVMStoragePoolResources;
  tags?: string[];
  url: string;
  version?: string;
  vms: number;
  zone?: number | null;
};

type Props = {
  rows: LxdKVMHostTableRow[];
};

type SortKey = "cpu" | "hostType" | "name" | "ram" | "storage" | "vms" | "zone";

const getSortValue = (
  sortKey: SortKey,
  row: LxdKVMHostTableRow,
  zones?: ZoneResponse[]
): number | string | null => {
  const zone = zones?.find((zone) => row.zone === zone.id);
  switch (sortKey) {
    case "zone":
      return zone?.name || "unknown";
    case "cpu":
      return row.cpuCores.allocated_tracked;
    case "ram":
      return (
        row.memory.general.allocated_tracked +
        row.memory.hugepages.allocated_tracked
      );
    case "storage":
      return row.storage.allocated_tracked;
  }
  const value = row[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (rows: LxdKVMHostTableRow[]) =>
  rows.map((row) => {
    const isCluster = row.hostType === LxdKVMHostType.Cluster;
    return {
      key: row.key,
      columns: [
        {
          className: "name-col",
          content: (
            <NameColumn name={row.name} secondary={row.project} url={row.url} />
          ),
        },
        {
          className: "host-type-col",
          content: (
            <DoubleRow
              icon={<Icon name={isCluster ? "cluster" : "single-host"} />}
              primary={
                <span data-testid="host-type">
                  {isCluster ? "Cluster" : "Single host"}
                </span>
              }
              secondary={
                isCluster ? (
                  <span data-testid="hosts-count">
                    {pluralize("KVM host", row.hostsCount, true)}
                  </span>
                ) : null
              }
            />
          ),
        },
        {
          className: "vms-col u-align--right",
          content: <VMsColumn version={row.version} vms={row.vms} />,
        },
        {
          className: "tags-col",
          content: row.tags ? <TagsColumn tags={row.tags} /> : null,
        },
        {
          className: "zone-col",
          content:
            row.pool || row.pool === 0 || row.zone || row.zone === 0 ? (
              <PoolColumn poolId={row.pool} zoneId={row.zone} />
            ) : null,
        },
        {
          className: "cpu-col",
          content: (
            <CPUColumn cores={row.cpuCores} overCommit={row.cpuOverCommit} />
          ),
        },
        {
          className: "ram-col",
          content: (
            <RAMColumn memory={row.memory} overCommit={row.memoryOverCommit} />
          ),
        },
        {
          className: "storage-col",
          content: (
            <StorageColumn
              defaultPoolId={row.defaultPoolID}
              pools={row.storagePools}
              storage={row.storage}
            />
          ),
        },
      ],
    };
  });

const LxdKVMHostTable = ({ rows }: Props): JSX.Element => {
  const zones = useZones();
  const { currentSort, sortRows, updateSort } = useTableSort<
    LxdKVMHostTableRow,
    SortKey,
    ZoneResponse[]
  >(getSortValue, {
    key: "name",
    direction: SortDirection.DESCENDING,
  });
  const sortedRows = sortRows(rows, zones.data?.items);
  return (
    <MainTable
      className="lxd-table"
      emptyStateMsg="No hosts available."
      headers={[
        {
          className: "name-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="name-header"
                onClick={() => {
                  updateSort("name");
                }}
                sortKey="name"
              >
                Name
              </TableHeader>
              <TableHeader>Project</TableHeader>
            </>
          ),
        },
        {
          className: "host-type-col",
          content: (
            <TableHeader
              className="p-double-row__header-spacer"
              currentSort={currentSort}
              data-testid="host-type-header"
              onClick={() => {
                updateSort("hostType");
              }}
              sortKey="hostType"
            >
              KVM host type
            </TableHeader>
          ),
        },
        {
          className: "vms-col u-align--right",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="vms-header"
                onClick={() => {
                  updateSort("vms");
                }}
                sortKey="vms"
              >
                VM<span className="u-no-text-transform">s</span>
              </TableHeader>
              <TableHeader>LXD version</TableHeader>
            </>
          ),
        },
        {
          className: "tags-col",
          content: <TableHeader data-testid="tags-header">Tags</TableHeader>,
        },
        {
          className: "zone-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="zone-header"
                onClick={() => {
                  updateSort("zone");
                }}
                sortKey="zone"
              >
                AZ
              </TableHeader>
              <TableHeader>Resource pool</TableHeader>
            </>
          ),
        },
        {
          className: "cpu-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="cpu-header"
              onClick={() => {
                updateSort("cpu");
              }}
              sortKey="cpu"
            >
              CPU cores
            </TableHeader>
          ),
        },
        {
          className: "ram-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="ram-header"
              onClick={() => {
                updateSort("ram");
              }}
              sortKey="ram"
            >
              RAM
            </TableHeader>
          ),
        },
        {
          className: "storage-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="storage-header"
              onClick={() => {
                updateSort("storage");
              }}
              sortKey="storage"
            >
              Storage
            </TableHeader>
          ),
        },
      ]}
      paginate={50}
      rows={generateRows(sortedRows)}
    />
  );
};

export default LxdKVMHostTable;
