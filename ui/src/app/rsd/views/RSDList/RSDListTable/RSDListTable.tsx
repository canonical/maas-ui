import { useEffect } from "react";

import { Col, Input, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import CPUColumn from "app/kvm/views/KVMList/KVMListTable/CPUColumn";
import NameColumn from "app/kvm/views/KVMList/KVMListTable/NameColumn";
import PoolColumn from "app/kvm/views/KVMList/KVMListTable/PoolColumn";
import RAMColumn from "app/kvm/views/KVMList/KVMListTable/RAMColumn";
import StorageColumn from "app/kvm/views/KVMList/KVMListTable/StorageColumn";
import VMsColumn from "app/kvm/views/KVMList/KVMListTable/VMsColumn";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { actions as poolActions } from "app/store/resourcepool";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";
import { actions as zoneActions } from "app/store/zone";
import { generateCheckboxHandlers, someInArray, someNotAll } from "app/utils";

type SortKey = keyof Pod | "cpu" | "pool" | "ram" | "storage";

const getSortValue = (sortKey: SortKey, rsd: Pod, pools: ResourcePool[]) => {
  const rsdPool = pools.find((pool) => rsd.pool === pool.id);

  switch (sortKey) {
    case "cpu":
      return rsd.used.cores;
    case "pool":
      return rsdPool?.name || "unknown";
    case "ram":
      return rsd.used.memory;
    case "storage":
      return rsd.used.local_storage;
    default:
      return rsd[sortKey];
  }
};

const generateRows = (
  rsds: Pod[],
  selectedRSDIDs: Pod["id"][],
  handleRowCheckbox: (rsdID: Pod["id"], selectedRSDIDs: Pod["id"][]) => void
) =>
  rsds.map((rsd) => ({
    key: rsd.id,
    columns: [
      {
        content: (
          <NameColumn
            handleCheckbox={() => handleRowCheckbox(rsd.id, selectedRSDIDs)}
            id={rsd.id}
            selected={someInArray(rsd.id, selectedRSDIDs)}
          />
        ),
      },
      { className: "u-align--right", content: <VMsColumn id={rsd.id} /> },
      { content: <PoolColumn id={rsd.id} /> },
      { content: <CPUColumn id={rsd.id} /> },
      { content: <RAMColumn id={rsd.id} /> },
      { content: <StorageColumn id={rsd.id} /> },
    ],
  }));

const RSDListTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const rsds = useSelector(podSelectors.rsds);
  const selectedRSDIDs = useSelector(podSelectors.selectedRSDs).map(
    (rsd) => rsd.id
  );
  const pools = useSelector(poolSelectors.all);
  const rsdIDs = rsds.map((rsd) => rsd.id);

  const { currentSort, sortRows, updateSort } = useTableSort<Pod, SortKey>(
    getSortValue,
    {
      key: "name",
      direction: "descending",
    }
  );
  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    Pod["id"]
  >((ids) => dispatch(podActions.setSelected(ids)));

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const sortedRSDs = sortRows(rsds, pools);

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="rsd-list-table"
          headers={[
            {
              content: (
                <div className="u-flex">
                  <Input
                    checked={someInArray(rsdIDs, selectedRSDIDs)}
                    className={classNames("has-inline-label", {
                      "p-checkbox--mixed": someNotAll(rsdIDs, selectedRSDIDs),
                    })}
                    data-test="all-rsds-checkbox"
                    disabled={rsds.length === 0}
                    id="all-rsds-checkbox"
                    label={" "}
                    onChange={() => handleGroupCheckbox(rsdIDs, selectedRSDIDs)}
                    type="checkbox"
                    wrapperClassName="u-no-margin--bottom u-align-header-checkbox u-nudge--checkbox"
                  />
                  <TableHeader
                    currentSort={currentSort}
                    data-test="fqdn-header"
                    onClick={() => updateSort("name")}
                    sortKey="name"
                  >
                    FQDN
                  </TableHeader>
                </div>
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
          rows={generateRows(sortedRSDs, selectedRSDIDs, handleRowCheckbox)}
        />
      </Col>
    </Row>
  );
};

export default RSDListTable;
