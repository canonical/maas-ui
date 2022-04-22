import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import CPUColumn from "app/kvm/components/CPUColumn";
import NameColumn from "app/kvm/components/NameColumn";
import PoolColumn from "app/kvm/components/PoolColumn";
import RAMColumn from "app/kvm/components/RAMColumn";
import StorageColumn from "app/kvm/components/StorageColumn";
import TagsColumn from "app/kvm/components/TagsColumn";
import VMsColumn from "app/kvm/components/VMsColumn";
import kvmURLs from "app/kvm/urls";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";
import { isComparable } from "app/utils";

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage" | "vms";

const getSortValue = (sortKey: SortKey, kvm: Pod, pools?: ResourcePool[]) => {
  const { resources } = kvm;
  const { cores, memory, storage, vm_count } = resources;
  const kvmPool = pools?.find((pool) => kvm.pool === pool.id);

  switch (sortKey) {
    case "pool":
      return kvmPool?.name || "unknown";
    case "cpu":
      return cores.allocated_tracked;
    case "ram":
      return (
        memory.general.allocated_tracked + memory.hugepages.allocated_tracked
      );
    case "storage":
      return storage.allocated_tracked;
    case "tags":
      return (kvm.tags.length && kvm.tags[0]) || "";
    case "vms":
      return vm_count.tracked;
  }
  const value = kvm[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (kvms: Pod[]) =>
  kvms.map((kvm) => ({
    key: kvm.id,
    columns: [
      {
        className: "name-col",
        content: (
          <NameColumn
            name={kvm.name}
            secondary={kvm.power_parameters.power_address}
            url={kvmURLs.virsh.details.index({ id: kvm.id })}
          />
        ),
      },
      {
        className: "vms-col u-align--right",
        content: <VMsColumn vms={kvm.resources.vm_count.tracked} />,
      },
      {
        className: "tags-col",
        content: <TagsColumn tags={kvm.tags} />,
      },
      {
        className: "pool-col",
        content: <PoolColumn poolId={kvm.pool} zoneId={kvm.zone} />,
      },
      {
        className: "cpu-col",
        content: (
          <CPUColumn
            cores={kvm.resources.cores}
            overCommit={kvm.cpu_over_commit_ratio}
          />
        ),
      },
      {
        className: "ram-col",
        content: (
          <RAMColumn
            memory={kvm.resources.memory}
            overCommit={kvm.memory_over_commit_ratio}
          />
        ),
      },
      {
        className: "storage-col",
        content: (
          <StorageColumn
            pools={kvm.resources.storage_pools}
            storage={kvm.resources.storage}
          />
        ),
      },
    ],
  }));

const VirshTable = (): JSX.Element => {
  const virshKvms = useSelector(podSelectors.virsh);
  const pools = useSelector(poolSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<
    Pod,
    SortKey,
    ResourcePool[]
  >(getSortValue, {
    key: "name",
    direction: SortDirection.DESCENDING,
  });
  const sortedKVMs = sortRows(virshKvms, pools);

  return (
    <MainTable
      className="virsh-table"
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
              <TableHeader>Address</TableHeader>
            </>
          ),
        },
        {
          className: "vms-col u-align--right",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="vms-header"
              onClick={() => updateSort("vms")}
              sortKey="vms"
            >
              VM<span className="u-no-text-transform">s</span>
            </TableHeader>
          ),
        },
        {
          className: "tags-col",
          content: (
            <TableHeader data-testid="tags-header" sortKey="tags">
              Tags
            </TableHeader>
          ),
        },
        {
          className: "pool-col",
          content: (
            <>
              <TableHeader
                currentSort={currentSort}
                data-testid="pool-header"
                onClick={() => updateSort("pool")}
                sortKey="pool"
              >
                Resource pool
              </TableHeader>
              <TableHeader>Az</TableHeader>
            </>
          ),
        },
        {
          className: "cpu-col",
          content: (
            <TableHeader
              currentSort={currentSort}
              data-testid="cpu-header"
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
              currentSort={currentSort}
              data-testid="ram-header"
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
              currentSort={currentSort}
              data-testid="storage-header"
              onClick={() => updateSort("storage")}
              sortKey="storage"
            >
              Storage
            </TableHeader>
          ),
        },
      ]}
      paginate={50}
      rows={generateRows(sortedKVMs)}
    />
  );
};

export default VirshTable;
