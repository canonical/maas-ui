import {
  Button,
  Col,
  Loader,
  MainTable,
  Row
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import pluralize from "pluralize";

import "./MachineList.scss";
import {
  general as generalActions,
  machine as machineActions,
  resourcepool as resourcePoolActions,
  scripts as scriptActions,
  service as serviceActions,
  tag as tagActions,
  user as userActions,
  zone as zoneActions
} from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { nodeStatus } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import TableHeader from "app/base/components/TableHeader";
import CoresColumn from "./CoresColumn";
import DisksColumn from "./DisksColumn";
import FabricColumn from "./FabricColumn";
import NameColumn from "./NameColumn";
import OwnerColumn from "./OwnerColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RamColumn from "./RamColumn";
import StatusColumn from "./StatusColumn";
import StorageColumn from "./StorageColumn";
import ZoneColumn from "./ZoneColumn";

const normaliseStatus = (statusCode, status) => {
  switch (statusCode) {
    case nodeStatus.FAILED_COMMISSIONING:
    case nodeStatus.FAILED_DEPLOYMENT:
    case nodeStatus.FAILED_RELEASING:
    case nodeStatus.FAILED_DISK_ERASING:
    case nodeStatus.FAILED_ENTERING_RESCUE_MODE:
    case nodeStatus.FAILED_EXITING_RESCUE_MODE:
    case nodeStatus.FAILED_TESTING:
      return "Failed";
    case nodeStatus.RESCUE_MODE:
    case nodeStatus.ENTERING_RESCUE_MODE:
    case nodeStatus.EXITING_RESCUE_MODE:
      return "Rescue mode";
    case nodeStatus.RELEASING:
    case nodeStatus.DISK_ERASING:
      return "Releasing";
    case nodeStatus.RETIRED:
    case nodeStatus.MISSING:
    case nodeStatus.RESERVED:
      return "Other";
    default:
      return status;
  }
};

const getSortValue = (machine, currentSort) => {
  switch (currentSort) {
    case "domain":
    case "pool":
    case "zone":
      return machine[currentSort].name;
    default:
      return machine[currentSort];
  }
};

const generateRows = ({ rows, showMAC }) => {
  return rows.map(row => {
    return {
      className: "machine-list__machine",
      columns: [
        {
          content: <NameColumn showMAC={showMAC} systemId={row.system_id} />
        },
        {
          content: <PowerColumn systemId={row.system_id} />
        },
        {
          content: <StatusColumn systemId={row.system_id} />
        },
        {
          content: <OwnerColumn systemId={row.system_id} />
        },
        {
          content: <PoolColumn systemId={row.system_id} />
        },
        {
          content: <ZoneColumn systemId={row.system_id} />
        },
        {
          content: <FabricColumn systemId={row.system_id} />
        },
        {
          content: <CoresColumn systemId={row.system_id} />
        },
        {
          content: <RamColumn systemId={row.system_id} />
        },
        {
          content: <DisksColumn systemId={row.system_id} />
        },
        {
          content: <StorageColumn systemId={row.system_id} />
        }
      ]
    };
  });
};

const generateGroups = ({ groups, hiddenGroups, setHiddenGroups, showMAC }) => {
  let rows = [];
  groups.forEach(group => {
    const { items, label, sortKey } = group;
    const collapsed = hiddenGroups.includes(label);
    rows.push({
      className: "machine-list__group",
      columns: [
        {
          content: (
            <>
              <strong>{label}</strong>
              <div className="u-text--light">{`
              ${items.length} ${pluralize("machine", items.length)}`}</div>
            </>
          )
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
          className: "machine-list__group-toggle",
          content: (
            <Button
              appearance="base"
              className="machine-list__group-toggle-button"
              onClick={() => {
                if (collapsed) {
                  setHiddenGroups(
                    hiddenGroups.filter(group => group !== label)
                  );
                } else {
                  setHiddenGroups(hiddenGroups.concat([label]));
                }
              }}
            >
              {collapsed ? (
                <i className="p-icon--plus">Show</i>
              ) : (
                <i className="p-icon--minus">Hide</i>
              )}
            </Button>
          )
        }
      ]
    });
    const visibleItems = items
      .filter(machine => {
        return !hiddenGroups.includes(getSortValue(machine, sortKey));
      })
      .sort((a, b) => (a.hostname > b.hostname ? 1 : -1));
    rows = rows.concat(generateRows({ rows: visibleItems, showMAC }));
  });
  return rows;
};

const machineSort = currentSort => {
  const { key, direction } = currentSort;

  return function(a, b) {
    const sortA = getSortValue(a, key);
    const sortB = getSortValue(b, key);

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

const MachineList = () => {
  const dispatch = useDispatch();

  const [currentSort, setCurrentSort] = useState({
    key: "normalisedStatus",
    direction: "descending"
  });
  const [hiddenGroups, setHiddenGroups] = useState([]);
  const [showMAC, setShowMAC] = useState(false);

  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);

  const normalisedMachines = machines.map(machine => ({
    ...machine,
    normalisedStatus: normaliseStatus(machine.status_code, machine.status)
  }));
  const visibleMachines = normalisedMachines.filter(machine => {
    return !hiddenGroups.includes(getSortValue(machine, currentSort));
  });
  const sortedMachines = visibleMachines.sort(machineSort(currentSort));

  const groupKeys = [
    "domain",
    "normalisedStatus",
    "owner",
    "pool",
    "power_state",
    "zone"
  ];
  const groups =
    groupKeys.includes(currentSort.key) &&
    sortedMachines.reduce((acc, machine) => {
      const sortKey = getSortValue(machine, currentSort.key);
      const group = acc.find(group => group.label === sortKey);
      if (group) {
        group.items.push(machine);
      } else {
        acc.push({
          label: sortKey,
          sortKey: currentSort.key,
          items: [machine]
        });
      }
      return acc;
    }, []);

  useWindowTitle("Machines");

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchMachineActions());
    dispatch(generalActions.fetchOsInfo());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(generalActions.fetchVersion());
    dispatch(machineActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(scriptActions.fetch());
    dispatch(serviceActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(userActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch, machinesLoaded]);

  // Update sort parameters depending on whether the same sort key was clicked.
  const updateSort = newSortKey => {
    const { key, direction } = currentSort;

    if (newSortKey === key) {
      if (direction === "ascending") {
        setCurrentSort({ key: "", direction: "none" });
      } else {
        setCurrentSort({ key, direction: "ascending" });
      }
    } else {
      setCurrentSort({ key: newSortKey, direction: "descending" });
      setHiddenGroups([]);
    }
  };

  return (
    <Row>
      <Col size={12}>
        {machinesLoading && (
          <div className="u-align--center">
            <Loader text="Loading..." />
          </div>
        )}
        {machinesLoaded && (
          <MainTable
            className={classNames("p-table-expanding--light", "machine-list", {
              "machine-list--grouped": groups
            })}
            headers={[
              {
                content: (
                  <>
                    <TableHeader
                      currentSort={currentSort}
                      data-test="fqdn-header"
                      onClick={() => {
                        setShowMAC(false);
                        updateSort("fqdn");
                      }}
                      sortKey="fqdn"
                    >
                      FQDN
                    </TableHeader>
                    &nbsp;<strong>|</strong>&nbsp;
                    <TableHeader
                      currentSort={currentSort}
                      data-test="mac-header"
                      onClick={() => {
                        setShowMAC(true);
                        updateSort("pxe_mac");
                      }}
                      sortKey="pxe_mac"
                    >
                      MAC
                    </TableHeader>
                    <TableHeader>IP</TableHeader>
                  </>
                )
              },
              {
                content: (
                  <TableHeader
                    className="p-double-row__icon-space"
                    currentSort={currentSort}
                    data-test="power-header"
                    onClick={() => updateSort("power_state")}
                    sortKey="power_state"
                  >
                    Power
                  </TableHeader>
                )
              },
              {
                content: (
                  <TableHeader
                    className="p-double-row__icon-space"
                    currentSort={currentSort}
                    data-test="status-header"
                    onClick={() => updateSort("normalisedStatus")}
                    sortKey="normalisedStatus"
                  >
                    Status
                  </TableHeader>
                )
              },
              {
                content: (
                  <>
                    <TableHeader
                      currentSort={currentSort}
                      data-test="owner-header"
                      onClick={() => updateSort("owner")}
                      sortKey="owner"
                    >
                      Owner
                    </TableHeader>
                    <TableHeader>Tags</TableHeader>
                  </>
                )
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
                      Pool
                    </TableHeader>
                    <TableHeader>Note</TableHeader>
                  </>
                )
              },
              {
                content: (
                  <>
                    <TableHeader
                      currentSort={currentSort}
                      data-test="zone-header"
                      onClick={() => updateSort("zone")}
                      sortKey="zone"
                    >
                      Zone
                    </TableHeader>
                    <TableHeader>Spaces</TableHeader>
                  </>
                )
              },
              {
                content: (
                  <>
                    <TableHeader
                      currentSort={currentSort}
                      data-test="fabric-header"
                      onClick={() => updateSort("fabric")}
                      sortKey="fabric"
                    >
                      Fabric
                    </TableHeader>
                    <TableHeader>VLAN</TableHeader>
                  </>
                )
              },
              {
                content: (
                  <>
                    <TableHeader
                      currentSort={currentSort}
                      data-test="cores-header"
                      onClick={() => updateSort("cpu_count")}
                      sortKey="cpu_count"
                    >
                      Cores
                    </TableHeader>
                    <TableHeader>Arch</TableHeader>
                  </>
                ),
                className: "u-align--right"
              },
              {
                content: (
                  <TableHeader
                    currentSort={currentSort}
                    data-test="memory-header"
                    onClick={() => updateSort("memory")}
                    sortKey="memory"
                  >
                    RAM
                  </TableHeader>
                ),
                className: "u-align--right"
              },
              {
                content: (
                  <TableHeader
                    currentSort={currentSort}
                    data-test="disks-header"
                    onClick={() => updateSort("physical_disk_count")}
                    sortKey="physical_disk_count"
                  >
                    Disks
                  </TableHeader>
                ),
                className: "u-align--right"
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
                className: "u-align--right"
              }
            ]}
            paginate={150}
            rows={
              groups
                ? generateGroups({
                    groups,
                    hiddenGroups,
                    setHiddenGroups,
                    showMAC
                  })
                : generateRows({ rows: visibleMachines, showMAC })
            }
          />
        )}
      </Col>
    </Row>
  );
};

export default MachineList;
