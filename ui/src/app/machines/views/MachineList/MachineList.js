import {
  Button,
  Col,
  Loader,
  MainTable,
  Row,
  SearchBox,
  Select
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
import { groupAsMap, simpleSortByKey } from "app/utils";
import { machine as machineSelectors } from "app/base/selectors";
import { nodeStatus } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import CoresColumn from "./CoresColumn";
import DisksColumn from "./DisksColumn";
import FabricColumn from "./FabricColumn";
import GroupSelect from "./GroupSelect";
import NameColumn from "./NameColumn";
import OwnerColumn from "./OwnerColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RamColumn from "./RamColumn";
import StatusColumn from "./StatusColumn";
import StorageColumn from "./StorageColumn";
import TableHeader from "app/base/components/TableHeader";
import ZoneColumn from "./ZoneColumn";

const getSortValue = (machine, sortKey) => {
  switch (sortKey) {
    case "domain":
      return machine.domain && machine.domain.name;
    case "pool":
      return machine.pool && machine.pool.name;
    case "zone":
      return machine.zone && machine.zone.name;
    case "fabric":
      return machine.vlan && machine.vlan.fabric_name;
    default:
      return machine[sortKey];
  }
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

const generateRows = ({
  activeRow,
  currentSort,
  machines,
  setActiveRow,
  showMAC
}) => {
  const sortedMachines = [...machines].sort(machineSort(currentSort));
  return sortedMachines.map(row => {
    const isActive = activeRow === row.system_id;
    const onToggleMenu = open => {
      if (open && !activeRow) {
        setActiveRow(row.system_id);
      } else if (!open || (open && activeRow)) {
        setActiveRow(null);
      }
    };

    return {
      className: classNames("machine-list__machine", {
        "machine-list__machine--active": isActive
      }),
      columns: [
        {
          content: (
            <NameColumn
              onToggleMenu={onToggleMenu}
              showMAC={showMAC}
              systemId={row.system_id}
            />
          )
        },
        {
          content: (
            <PowerColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <StatusColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          )
        },
        {
          content: (
            <OwnerColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <PoolColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <ZoneColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <FabricColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          )
        },
        {
          content: (
            <CoresColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <RamColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <DisksColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          )
        },
        {
          content: (
            <StorageColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          )
        }
      ]
    };
  });
};

const generateGroups = ({
  activeRow,
  currentSort,
  grouping,
  hiddenGroups,
  machines,
  setActiveRow,
  setHiddenGroups,
  showMAC
}) => {
  let groups = [];
  let rows = [];

  if (grouping === "owner") {
    const groupMap = groupAsMap(machines, machine => machine.owner);
    groups = Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No owner", machines }))
      .sort(simpleSortByKey("label"));
  }

  if (grouping === "pool") {
    const groupMap = groupAsMap(machines, machine => machine.pool.name);
    groups = Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No pool", machines }))
      .sort(simpleSortByKey("label"));
  }

  if (grouping === "power_state") {
    const groupMap = groupAsMap(machines, machine => machine.power_state);
    groups = [
      {
        label: "Error",
        machines: groupMap.get("error") || []
      },
      {
        label: "Off",
        machines: groupMap.get("off") || []
      },
      {
        label: "On",
        machines: groupMap.get("on") || []
      },
      {
        label: "Unknown",
        machines: groupMap.get("unknown") || []
      }
    ].filter(group => group.machines.length);
  }

  if (grouping === "status") {
    const groupMap = groupAsMap(machines, machine => machine.status_code);
    groups = [
      {
        label: "Failed",
        machines: [
          ...(groupMap.get(nodeStatus.FAILED_COMMISSIONING) || []),
          ...(groupMap.get(nodeStatus.FAILED_DEPLOYMENT) || []),
          ...(groupMap.get(nodeStatus.FAILED_DISK_ERASING) || []),
          ...(groupMap.get(nodeStatus.FAILED_ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.FAILED_EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.FAILED_RELEASING) || []),
          ...(groupMap.get(nodeStatus.FAILED_TESTING) || [])
        ]
      },
      {
        label: "New",
        machines: groupMap.get(nodeStatus.NEW) || []
      },
      {
        label: "Commissioning",
        machines: groupMap.get(nodeStatus.COMMISSIONING) || []
      },
      {
        label: "Testing",
        machines: groupMap.get(nodeStatus.TESTING) || []
      },
      {
        label: "Ready",
        machines: groupMap.get(nodeStatus.READY) || []
      },
      {
        label: "Allocated",
        machines: groupMap.get(nodeStatus.ALLOCATED) || []
      },
      {
        label: "Deploying",
        machines: groupMap.get(nodeStatus.DEPLOYING) || []
      },
      {
        label: "Deployed",
        machines: groupMap.get(nodeStatus.DEPLOYED) || []
      },
      {
        label: "Rescue mode",
        machines: [
          ...(groupMap.get(nodeStatus.ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.RESCUE_MODE) || [])
        ]
      },
      {
        label: "Releasing",
        machines: [
          ...(groupMap.get(nodeStatus.DISK_ERASING) || []),
          ...(groupMap.get(nodeStatus.RELEASING) || [])
        ]
      },
      {
        label: "Broken",
        machines: groupMap.get(nodeStatus.BROKEN) || []
      },
      {
        label: "Other",
        machines: [
          ...(groupMap.get(nodeStatus.MISSING) || []),
          ...(groupMap.get(nodeStatus.RESERVED) || []),
          ...(groupMap.get(nodeStatus.RETIRED) || [])
        ]
      }
    ].filter(group => group.machines.length);
  }

  if (grouping === "zone") {
    const groupMap = groupAsMap(machines, machine => machine.zone.name);
    groups = Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No zone", machines }))
      .sort(simpleSortByKey("label"));
  }

  groups.forEach(group => {
    const { label, machines } = group;
    const collapsed = hiddenGroups.includes(label);
    rows.push({
      className: "machine-list__group",
      columns: [
        {
          content: (
            <>
              <strong>{label}</strong>
              <div className="u-text--light">{`
              ${machines.length} ${pluralize(
                "machine",
                machines.length
              )}`}</div>
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
    const visibleMachines = collapsed ? [] : machines;
    rows = rows.concat(
      generateRows({
        activeRow,
        currentSort,
        machines: visibleMachines,
        setActiveRow,
        showMAC
      })
    );
  });
  return rows;
};

const MachineList = () => {
  const dispatch = useDispatch();

  const [currentSort, setCurrentSort] = useState({
    key: "fqdn",
    direction: "descending"
  });
  const [grouping, setGrouping] = useState("status");
  const [hiddenGroups, setHiddenGroups] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [showMAC, setShowMAC] = useState(false);

  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);

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
    }
  };

  return (
    <>
      <Row>
        <Col size={3}>
          <Select
            name="machineFilters"
            defaultValue=""
            options={[
              {
                value: "",
                disabled: "disabled",
                label: "Filters"
              }
            ]}
          />
        </Col>
        <Col size={6}>
          <SearchBox onChange={() => null} />
        </Col>
        <Col size={3}>
          <GroupSelect
            grouping={grouping}
            setGrouping={setGrouping}
            setHiddenGroups={setHiddenGroups}
          />
        </Col>
      </Row>
      {machinesLoading && (
        <Row>
          <Col className="u-align--center" size={12}>
            <Loader text="Loading..." />
          </Col>
        </Row>
      )}
      {machinesLoaded && (
        <Row>
          <Col size={12}>
            <MainTable
              className={classNames(
                "p-table-expanding--light",
                "machine-list",
                {
                  "machine-list--grouped": grouping !== "none"
                }
              )}
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
                      className="p-double-row__header-spacer"
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
                      className="p-double-row__header-spacer"
                      currentSort={currentSort}
                      data-test="status-header"
                      onClick={() => updateSort("status")}
                      sortKey="status"
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
                grouping === "none"
                  ? generateRows({
                      activeRow,
                      currentSort,
                      machines,
                      setActiveRow,
                      showMAC
                    })
                  : generateGroups({
                      activeRow,
                      currentSort,
                      grouping,
                      hiddenGroups,
                      machines,
                      setActiveRow,
                      setHiddenGroups,
                      showMAC
                    })
              }
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default MachineList;
