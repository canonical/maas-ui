import { Icon, MainTable } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import CPUColumn from "app/kvm/components/CPUColumn";
import NameColumn from "app/kvm/components/NameColumn";
import PoolColumn from "app/kvm/components/PoolColumn";
import RAMColumn from "app/kvm/components/RAMColumn";
import type { Props as RAMColumnProps } from "app/kvm/components/RAMColumn/RAMColumn";
import StorageColumn from "app/kvm/components/StorageColumn";
import TagsColumn from "app/kvm/components/TagsColumn";
import VMsColumn from "app/kvm/components/VMsColumn";
import type { KVMResource, KVMStoragePoolResources } from "app/kvm/types";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";
import zoneSelectors from "app/store/zone/selectors";
import type { Zone } from "app/store/zone/types";
import { isComparable } from "app/utils";

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
  key: string | number;
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

type SortKey = "hostType" | "name" | "cpu" | "zone" | "ram" | "storage" | "vms";

const getSortValue = (
  sortKey: SortKey,
  row: LxdKVMHostTableRow,
  zones?: Zone[]
): string | number | null => {
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
      key: row.key,
    };
  });

const LxdKVMHostTable = ({ rows }: Props): JSX.Element => {
  const zones = useSelector(zoneSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<
    LxdKVMHostTableRow,
    SortKey,
    Zone[]
  >(getSortValue, {
    direction: SortDirection.DESCENDING,
    key: "name",
  });
  const sortedRows = sortRows(rows, zones);
  return (
    <MainTable
      className="lxd-table"
      headers={[
        {
          className: "name-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="name-header"
                onClick={() => updateSort("name")}
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
              onClick={() => updateSort("hostType")}
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
                onClick={() => updateSort("vms")}
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
                data-testid="zone-header"
                currentSort={currentSort}
                onClick={() => updateSort("zone")}
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
              data-testid="cpu-header"
              currentSort={currentSort}
              onClick={() => updateSort("cpu")}
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
              data-testid="ram-header"
              currentSort={currentSort}
              onClick={() => updateSort("ram")}
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
              data-testid="storage-header"
              currentSort={currentSort}
              onClick={() => updateSort("storage")}
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
