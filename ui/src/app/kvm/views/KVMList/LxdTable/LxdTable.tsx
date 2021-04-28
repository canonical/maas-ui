import type { ReactNode } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import { useSelector } from "react-redux";

import CPUColumn from "../CPUColumn";
import NameColumn from "../NameColumn";
import PoolColumn from "../PoolColumn";
import RAMColumn from "../RAMColumn";
import StorageColumn from "../StorageColumn";
import TagsColumn from "../TagsColumn";
import VMsColumn from "../VMsColumn";

import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import podSelectors from "app/store/pod/selectors";
import type { LxdServerGroup, Pod } from "app/store/pod/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type LxdTableRow = {
  className?: string;
  columns: { className?: string; content: ReactNode }[];
  key: Pod["id"];
};

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage";

const getSortValue = (sortKey: SortKey, pod: Pod, pools: ResourcePool[]) => {
  const { resources } = pod;
  const { cores, memory } = resources;
  const pool = pools.find((pool) => pod.pool === pool.id);

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
      return pod.used.local_storage;
    default:
      return pod[sortKey];
  }
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
            content: <NameColumn id={pod.id} />,
          },
          {
            className: "vms-col u-align--right",
            content: <VMsColumn id={pod.id} />,
          },
          {
            className: "tags-col",
            content: <TagsColumn id={pod.id} />,
          },
          {
            className: "pool-col",
            content: <PoolColumn id={pod.id} />,
          },
          {
            className: "cpu-col",
            content: <CPUColumn id={pod.id} />,
          },
          {
            className: "ram-col",
            content: <RAMColumn id={pod.id} />,
          },
          {
            className: "storage-col",
            content: <StorageColumn id={pod.id} />,
          },
        ],
      });
    });
    return rows;
  }, []);

const LxdTable = (): JSX.Element => {
  const lxdGroups = useSelector(podSelectors.groupByLxdServer);
  const pools = useSelector(poolSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<Pod, SortKey>(
    getSortValue,
    {
      key: "name",
      direction: "descending",
    }
  );
  const {
    currentSort: currentGroupSort,
    sortRows: sortGroups,
    updateSort: updateGroupSort,
  } = useTableSort<LxdServerGroup, keyof LxdServerGroup>(
    (key: keyof LxdServerGroup, group: LxdServerGroup) => group[key],
    {
      key: "address",
      direction: "descending",
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
                    onClick={() => updateSort("composed_machines_count")}
                    sortKey="composed_machines_count"
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
