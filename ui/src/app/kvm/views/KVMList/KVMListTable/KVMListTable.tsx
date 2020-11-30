import { useEffect } from "react";

import { Col, Input, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import CPUColumn from "./CPUColumn";
import NameColumn from "./NameColumn";
import OSColumn from "./OSColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RAMColumn from "./RAMColumn";
import StorageColumn from "./StorageColumn";
import TypeColumn from "./TypeColumn";
import VMsColumn from "./VMsColumn";

import { general as generalActions } from "app/base/actions";
import TableHeader from "app/base/components/TableHeader";
import { useTableSort } from "app/base/hooks";
import type { TSFixMe } from "app/base/types";
import { actions as controllerActions } from "app/store/controller";
import type { Controller } from "app/store/controller/types";
import generalSelectors from "app/store/general/selectors";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import { actions as poolActions } from "app/store/resourcepool";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";
import { actions as zoneActions } from "app/store/zone";
import {
  generateCheckboxHandlers,
  getStatusText,
  someInArray,
  someNotAll,
} from "app/utils";

const getSortValue = (
  sortKey: keyof Pod | "cpu" | "os" | "pool" | "power" | "ram" | "storage",
  kvm: Pod,
  kvmHosts: (Controller | Machine)[],
  pools: ResourcePool[],
  osReleases: TSFixMe
) => {
  const kvmHost = kvmHosts.find((host) => host.system_id === kvm.host);
  const kvmPool = pools.find((pool) => kvm.pool === pool.id);

  switch (sortKey) {
    case "power":
      if (kvmHost && "power_state" in kvmHost) {
        return kvmHost.power_state;
      }
      return "unknown";
    case "os":
      if (kvmHost && kvmHost.osystem in osReleases) {
        return getStatusText(
          kvmHost,
          `${kvmHost.osystem}/${kvmHost.distro_series}`
        );
      }
      return "unknown";
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

const generateRows = (
  kvms: Pod[],
  selectedKVMIDs: Pod["id"][],
  handleRowCheckbox: (kvmID: Pod["id"], selectedKVMIDs: Pod["id"][]) => void
) =>
  kvms.map((kvm) => ({
    key: kvm.id,
    columns: [
      {
        content: (
          <NameColumn
            handleCheckbox={() => handleRowCheckbox(kvm.id, selectedKVMIDs)}
            id={kvm.id}
            selected={someInArray(kvm.id, selectedKVMIDs)}
          />
        ),
      },
      { content: <PowerColumn id={kvm.id} /> },
      { content: <TypeColumn id={kvm.id} /> },
      { className: "u-align--right", content: <VMsColumn id={kvm.id} /> },
      { content: <OSColumn id={kvm.id} /> },
      { content: <PoolColumn id={kvm.id} /> },
      { content: <CPUColumn id={kvm.id} /> },
      { content: <RAMColumn id={kvm.id} /> },
      { content: <StorageColumn id={kvm.id} /> },
    ],
  }));

const KVMListTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const osReleases = useSelector(generalSelectors.osInfo.getAllOsReleases);
  const kvms = useSelector(podSelectors.kvms);
  const selectedKVMIDs = useSelector(podSelectors.selectedKVMs).map(
    (kvm) => kvm.id
  );
  const kvmHosts = useSelector(podSelectors.getAllHosts);
  const pools = useSelector(poolSelectors.all);
  const kvmIDs = kvms.map((kvm) => kvm.id);

  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "name",
    direction: "descending",
  });
  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    Pod["id"]
  >((ids) => dispatch(podActions.setSelected(ids)));

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const sortedKVMs = sortRows(kvms, kvmHosts, pools, osReleases);

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="kvm-list-table"
          headers={[
            {
              content: (
                <div className="u-flex">
                  <Input
                    checked={someInArray(kvmIDs, selectedKVMIDs)}
                    className={classNames("has-inline-label", {
                      "p-checkbox--mixed": someNotAll(kvmIDs, selectedKVMIDs),
                    })}
                    data-test="all-pods-checkbox"
                    disabled={kvms.length === 0}
                    id="all-pods-checkbox"
                    label={" "}
                    onChange={() => handleGroupCheckbox(kvmIDs, selectedKVMIDs)}
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
              content: (
                <TableHeader
                  className="p-double-row__header-spacer"
                  currentSort={currentSort}
                  data-test="power-header"
                  onClick={() => updateSort("power")}
                  sortKey="power"
                >
                  Power
                </TableHeader>
              ),
            },
            {
              content: (
                <TableHeader
                  currentSort={currentSort}
                  data-test="type-header"
                  onClick={() => updateSort("type")}
                  sortKey="type"
                >
                  KVM host type
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
                <TableHeader
                  className="p-double-row__header-spacer"
                  currentSort={currentSort}
                  data-test="os-header"
                  onClick={() => updateSort("os")}
                  sortKey="os"
                >
                  OS
                </TableHeader>
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
          rows={generateRows(sortedKVMs, selectedKVMIDs, handleRowCheckbox)}
        />
      </Col>
    </Row>
  );
};

export default KVMListTable;
