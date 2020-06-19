import { Col, MainTable, Row } from "@canonical/react-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getStatusText } from "app/utils";
import {
  controller as controllerActions,
  general as generalActions,
  machine as machineActions,
  pod as podActions,
  resourcepool as poolActions,
  zone as zoneActions,
} from "app/base/actions";
import {
  Controller,
  Machine,
  Pod,
  ResourcePool,
  TSFixMe,
} from "app/base/types";
import {
  general as generalSelectors,
  pod as podSelectors,
  resourcepool as poolSelectors,
} from "app/base/selectors";
import CPUColumn from "./CPUColumn";
import NameColumn from "./NameColumn";
import OSColumn from "./OSColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RAMColumn from "./RAMColumn";
import StorageColumn from "./StorageColumn";
import TableHeader from "app/base/components/TableHeader";
import TypeColumn from "./TypeColumn";
import VMsColumn from "./VMsColumn";

type Sort = {
  direction: "ascending" | "descending" | "none";
  key: string;
};

const podSort = (
  currentSort: Sort,
  podHosts: (Controller | Machine)[],
  pools: ResourcePool[],
  osReleases: TSFixMe
) => {
  const getSortValue = (pod: Pod, sortKey: Sort["key"]) => {
    const podHost = podHosts.find((host) => host.system_id === pod.host);
    const podPool = pools.find((pool) => pod.pool === pool.id);

    switch (sortKey) {
      case "power":
        if (podHost && "power_state" in podHost) {
          return podHost.power_state;
        }
        return "unknown";
      case "os":
        if (podHost && podHost.osystem in osReleases) {
          return getStatusText(podHost, osReleases[podHost.osystem]);
        }
        return "unknown";
      case "pool":
        return podPool?.name || "unknown";
      case "cpu":
        return pod.used.cores;
      case "ram":
        return pod.used.memory;
      case "storage":
        return pod.used.local_storage;
      default:
        return pod[sortKey];
    }
  };

  const { key, direction } = currentSort;

  return function (podA: Pod, podB: Pod) {
    const sortA = getSortValue(podA, key);
    const sortB = getSortValue(podB, key);

    if (direction === "none") {
      return 0;
    }
    if (sortA < sortB) {
      return direction === "descending" ? -1 : 1;
    }
    if (sortA > sortB) {
      return direction === "descending" ? 1 : -1;
    }
    return 0;
  };
};

const generateRows = (
  pods: Pod[],
  currentSort: Sort,
  podHosts: (Controller | Machine)[],
  pools: ResourcePool[],
  osReleases: TSFixMe
) => {
  const sortedPods = [...pods].sort(
    podSort(currentSort, podHosts, pools, osReleases)
  );
  return sortedPods.map((pod) => ({
    key: pod.id,
    columns: [
      { content: <NameColumn id={pod.id} /> },
      { content: <PowerColumn id={pod.id} /> },
      { content: <TypeColumn id={pod.id} /> },
      { className: "u-align--right", content: <VMsColumn id={pod.id} /> },
      { content: <OSColumn id={pod.id} /> },
      { content: <PoolColumn id={pod.id} /> },
      { content: <CPUColumn id={pod.id} /> },
      { content: <RAMColumn id={pod.id} /> },
      { content: <StorageColumn id={pod.id} /> },
    ],
  }));
};

const KVMListTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const pods = useSelector(podSelectors.all);
  const podHosts = useSelector(podSelectors.getAllHosts);
  const pools = useSelector(poolSelectors.all);
  const osReleases = useSelector(generalSelectors.osInfo.getAllOsReleases);

  const [currentSort, setCurrentSort] = useState<Sort>({
    key: "name",
    direction: "descending",
  });

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  // Update sort parameters depending on whether the same sort key was clicked.
  const updateSort = (newSortKey: Sort["key"]) => {
    const { key, direction } = currentSort;

    if (newSortKey === key) {
      if (direction === "ascending") {
        setCurrentSort({ key: "", direction: "none" });
      } else {
        setCurrentSort({ key, direction: "ascending" });
      }
    } else {
      setCurrentSort({ key: newSortKey, direction: "descending" });
    }
  };

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
                  CPU
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
          rows={generateRows(pods, currentSort, podHosts, pools, osReleases)}
        />
      </Col>
    </Row>
  );
};

export default KVMListTable;
