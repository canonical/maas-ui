import { Col, Input, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
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

const checkboxChecked = (pods: Pod[], selectedPodIDs: number[]) =>
  pods.some((pod) => selectedPodIDs.includes(pod.id));

const checkboxMixed = (pods: Pod[], selectedPodIDs: number[]) =>
  selectedPodIDs.length && pods.some((pod) => !selectedPodIDs.includes(pod.id));

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
  handlePodCheckbox: (pod: Pod) => void,
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
      {
        content: <NameColumn handleCheckbox={handlePodCheckbox} id={pod.id} />,
      },
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
  const osReleases = useSelector(generalSelectors.osInfo.getAllOsReleases);
  const pods = useSelector(podSelectors.kvm);
  const podHosts = useSelector(podSelectors.getAllHosts);
  const pools = useSelector(poolSelectors.all);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);

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

  const handlePodCheckbox = (pod: Pod) => {
    let newSelectedPods: number[];
    if (checkboxChecked([pod], selectedPodIDs)) {
      newSelectedPods = selectedPodIDs.filter(
        (podID: number) => podID !== pod.id
      );
    } else {
      newSelectedPods = [...selectedPodIDs, pod.id];
    }
    dispatch(podActions.setSelected(newSelectedPods));
  };

  const handleAllCheckbox = () => {
    let newSelectedPods: number[];
    if (checkboxChecked(pods, selectedPodIDs)) {
      newSelectedPods = [];
    } else {
      newSelectedPods = pods.map((pod) => pod.id);
    }
    dispatch(podActions.setSelected(newSelectedPods));
  };

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
                    checked={
                      checkboxChecked(pods, selectedPodIDs) && pods.length !== 0
                    }
                    className={classNames("has-inline-label", {
                      "p-checkbox--mixed": checkboxMixed(pods, selectedPodIDs),
                    })}
                    data-test="all-pods-checkbox"
                    disabled={pods.length === 0}
                    id="all-pods-checkbox"
                    label={" "}
                    onChange={() => handleAllCheckbox()}
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
          rows={generateRows(
            pods,
            handlePodCheckbox,
            currentSort,
            podHosts,
            pools,
            osReleases
          )}
        />
      </Col>
    </Row>
  );
};

export default KVMListTable;
