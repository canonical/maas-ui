import { Col, MainTable, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

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
import type { KVMResource } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";
import { isComparable } from "app/utils";

export type LxdKVMHostTableRow = {
  cpuCores: KVMResource;
  cpuOverCommit: number;
  defaultPoolID?: Pod["default_storage_pool"];
  key: string | number;
  memory: RAMColumnProps["memory"];
  memoryOverCommit: number;
  name: string;
  podId?: Pod["id"];
  pool: number;
  project?: string;
  storage: KVMResource;
  tags: string[];
  url: string;
  version: string;
  vms: number;
  zone: number;
};

type Props = {
  rows: LxdKVMHostTableRow[];
};

type SortKey = "name" | "cpu" | "pool" | "ram" | "storage" | "vms";

const getSortValue = (
  sortKey: SortKey,
  row: LxdKVMHostTableRow,
  pools?: ResourcePool[]
): string | number | null => {
  const pool = pools?.find((pool) => row.pool === pool.id);
  switch (sortKey) {
    case "pool":
      return pool?.name || "unknown";
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
          // TODO display the host type:
          // https://github.com/canonical-web-and-design/app-squad/issues/287
          content: null,
        },
        {
          className: "vms-col u-align--right",
          content: <VMsColumn version={row.version} vms={row.vms} />,
        },
        {
          className: "tags-col",
          content: <TagsColumn tags={row.tags} />,
        },
        {
          className: "pool-col",
          content: <PoolColumn poolId={row.pool} zoneId={row.zone} />,
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
              defaultPoolID={row.defaultPoolID}
              podId={row.podId}
              storage={row.storage}
            />
          ),
        },
      ],
    };
  });

const LxdKVMHostTable = ({ rows }: Props): JSX.Element => {
  const pools = useSelector(poolSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<
    LxdKVMHostTableRow,
    SortKey,
    ResourcePool[]
  >(getSortValue, {
    key: "name",
    direction: SortDirection.DESCENDING,
  });
  const sortedRows = sortRows(rows, pools);
  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="lxd-table"
          headers={[
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
              // TODO: display the host type:
              // https://github.com/canonical-web-and-design/app-squad/issues/287
              className: "host-type-col",
              content: null,
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
          rows={generateRows(sortedRows)}
        />
      </Col>
    </Row>
  );
};

export default LxdKVMHostTable;
