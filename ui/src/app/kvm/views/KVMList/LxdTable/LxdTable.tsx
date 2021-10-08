import type { ReactNode } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
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
import type { LxdServerGroup, Pod } from "app/store/pod/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";
import { isComparable } from "app/utils";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type LxdTableRow = {
  className?: string;
  columns: { className?: string; content: ReactNode }[];
  key: Pod["id"];
};

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage" | "vms";

const getSortValue = (sortKey: SortKey, pod: Pod, pools?: ResourcePool[]) => {
  const { resources } = pod;
  const { cores, memory, storage, vm_count } = resources;
  const pool = pools?.find((pool) => pod.pool === pool.id);

  switch (sortKey) {
    case "pool":
      return pool?.name || "unknown";
    case "cpu":
      return cores.allocated_tracked;
    case "ram":
      return (
        memory.general.allocated_tracked + memory.hugepages.allocated_tracked
      );
    case "storage":
      return storage.allocated_tracked;
    case "vms":
      return vm_count.tracked;
  }
  const value = pod[sortKey];
  return isComparable(value) ? value : null;
};

const generateRows = (groups: LxdServerGroup[]) =>
  groups.reduce<LxdTableRow[]>((rows, group) => {
    group.pods.forEach((pod, i) => {
      const showAddress = i === 0;
      rows.push({
        key: pod.id,
        className: classNames({ "truncated-border": !showAddress }),
        columns: [
          {
            className: "address-col",
            content: showAddress ? (
              <strong data-test="lxd-address">{group.address}</strong>
            ) : null,
          },
          {
            className: "name-col",
            content: (
              <NameColumn
                name={pod.name}
                secondary={pod.power_parameters.project}
                url={kvmURLs.lxd.single.index({ id: pod.id })}
              />
            ),
          },
          {
            className: "vms-col u-align--right",
            content: (
              <VMsColumn
                version={pod.version}
                vms={pod.resources.vm_count.tracked}
              />
            ),
          },
          {
            className: "tags-col",
            content: <TagsColumn tags={pod.tags} />,
          },
          {
            className: "pool-col",
            content: <PoolColumn poolId={pod.pool} zoneId={pod.zone} />,
          },
          {
            className: "cpu-col",
            content: (
              <CPUColumn
                cores={pod.resources.cores}
                overCommit={pod.cpu_over_commit_ratio}
              />
            ),
          },
          {
            className: "ram-col",
            content: (
              <RAMColumn
                memory={pod.resources.memory}
                overCommit={pod.memory_over_commit_ratio}
              />
            ),
          },
          {
            className: "storage-col",
            content: (
              <StorageColumn
                defaultPoolID={pod.default_storage_pool}
                podId={pod.id}
                storage={pod.resources.storage}
              />
            ),
          },
        ],
      });
    });
    return rows;
  }, []);

const LxdTable = (): JSX.Element => {
  const lxdGroups = useSelector(podSelectors.groupByLxdServer);
  const pools = useSelector(poolSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<
    Pod,
    SortKey,
    ResourcePool[]
  >(getSortValue, {
    key: "name",
    direction: SortDirection.DESCENDING,
  });
  const {
    currentSort: currentGroupSort,
    sortRows: sortGroups,
    updateSort: updateGroupSort,
  } = useTableSort<LxdServerGroup, keyof LxdServerGroup>(
    (key: keyof LxdServerGroup, group: LxdServerGroup) => {
      const value = group[key];
      return isComparable(value) ? value : null;
    },
    {
      key: "address",
      direction: SortDirection.DESCENDING,
    }
  );
  const sortedGroups = sortGroups(lxdGroups).map((group) => ({
    ...group,
    pods: sortRows(group.pods, pools),
  }));

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="lxd-table"
          headers={[
            {
              className: "address-col",
              content: (
                <TableHeader
                  currentSort={currentGroupSort}
                  data-test="address-header"
                  onClick={() => updateGroupSort("address")}
                  sortKey="address"
                >
                  Address
                </TableHeader>
              ),
            },
            {
              className: "name-col",
              content: (
                <>
                  <TableHeader
                    currentSort={currentSort}
                    data-test="name-header"
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
              className: "vms-col u-align--right",
              content: (
                <>
                  <TableHeader
                    currentSort={currentSort}
                    data-test="vms-header"
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
              content: <TableHeader data-test="tags-header">Tags</TableHeader>,
            },
            {
              className: "pool-col",
              content: (
                <>
                  <TableHeader
                    data-test="pool-header"
                    currentSort={currentSort}
                    onClick={() => updateSort("pool")}
                    sortKey="pool"
                  >
                    Resource pool
                  </TableHeader>
                  <TableHeader>AZ</TableHeader>
                </>
              ),
            },
            {
              className: "cpu-col",
              content: (
                <TableHeader
                  data-test="cpu-header"
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
                  data-test="ram-header"
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
                  data-test="storage-header"
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
          rows={generateRows(sortedGroups)}
        />
      </Col>
    </Row>
  );
};

export default LxdTable;
