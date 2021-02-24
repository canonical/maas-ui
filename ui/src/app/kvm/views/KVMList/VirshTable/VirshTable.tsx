import { Col, MainTable, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CPUColumn from "../CPUColumn";
import NameColumn from "../NameColumn";
import PoolColumn from "../PoolColumn";
import RAMColumn from "../RAMColumn";
import StorageColumn from "../StorageColumn";
import VMsColumn from "../VMsColumn";

import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage";

const getSortValue = (sortKey: SortKey, kvm: Pod, pools: ResourcePool[]) => {
  const kvmPool = pools.find((pool) => kvm.pool === pool.id);

  switch (sortKey) {
    case "pool":
      return kvmPool?.name || "unknown";
    case "cpu":
      return kvm.used.cores;
    case "ram":
      return kvm.used.memory;
    case "storage":
      return kvm.used.local_storage;
    default:
      return kvm[sortKey];
  }
};

const generateRows = (kvms: Pod[]) =>
  kvms.map((kvm) => ({
    key: kvm.id,
    columns: [
      { content: <NameColumn id={kvm.id} /> },
      { className: "u-align--right", content: <VMsColumn id={kvm.id} /> },
      { content: <PoolColumn id={kvm.id} /> },
      { content: <CPUColumn id={kvm.id} /> },
      { content: <RAMColumn id={kvm.id} /> },
      { content: <StorageColumn id={kvm.id} /> },
    ],
  }));

const VirshTable = (): JSX.Element => {
  const virshKvms = useSelector(podSelectors.virsh);
  const pools = useSelector(poolSelectors.all);
  const { currentSort, sortRows, updateSort } = useTableSort<Pod, SortKey>(
    getSortValue,
    {
      key: "name",
      direction: "descending",
    }
  );
  const sortedKVMs = sortRows(virshKvms, pools);

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="kvm-list-table"
          headers={[
            {
              content: (
                <TableHeader
                  currentSort={currentSort}
                  data-test="fqdn-header"
                  onClick={() => updateSort("name")}
                  sortKey="name"
                >
                  FQDN
                </TableHeader>
              ),
            },
            {
              className: "u-align--right",
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
                  <TableHeader>Owners</TableHeader>
                </>
              ),
            },
            {
              content: (
                <>
                  <TableHeader
                    currentSort={currentSort}
                    data-test="pool-header"
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
              content: (
                <TableHeader
                  currentSort={currentSort}
                  data-test="cpu-header"
                  onClick={() => updateSort("cpu")}
                  sortKey="cpu"
                >
                  CPU cores
                </TableHeader>
              ),
            },
            {
              content: (
                <TableHeader
                  currentSort={currentSort}
                  data-test="ram-header"
                  onClick={() => updateSort("ram")}
                  sortKey="ram"
                >
                  RAM
                </TableHeader>
              ),
            },
            {
              content: (
                <TableHeader
                  currentSort={currentSort}
                  data-test="storage-header"
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
      </Col>
    </Row>
  );
};

export default VirshTable;
