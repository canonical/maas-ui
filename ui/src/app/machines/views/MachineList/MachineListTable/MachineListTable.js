import {
  Button,
  Col,
  Input,
  MainTable,
  Row,
  Strip,
} from "@canonical/react-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import pluralize from "pluralize";

import {
  general as generalActions,
  machine as machineActions,
  resourcepool as resourcePoolActions,
  scripts as scriptActions,
  service as serviceActions,
  tag as tagActions,
  user as userActions,
  zone as zoneActions,
} from "app/base/actions";
import { groupAsMap, simpleSortByKey } from "app/utils";
import { machine as machineSelectors } from "app/base/selectors";
import { nodeStatus } from "app/base/enum";
import CoresColumn from "./CoresColumn";
import DisksColumn from "./DisksColumn";
import DoubleRow from "app/base/components/DoubleRow";
import FabricColumn from "./FabricColumn";
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

const getGroupSecondaryString = (machines, selectedMachines) => {
  let string = `${machines.length} ${pluralize("machine", machines.length)}`;
  const selectedCount = machines.reduce(
    (sum, machine) => (selectedMachines.includes(machine) ? sum + 1 : sum),
    0
  );

  if (selectedCount) {
    if (selectedCount === machines.length) {
      string = `${string} selected`;
    } else {
      string = `${string}, ${selectedCount} selected`;
    }
  }
  return string;
};

const checkboxChecked = (machines, selectedMachines) =>
  machines.every((machine) => selectedMachines.includes(machine));

const machineSort = (currentSort) => {
  const { key, direction } = currentSort;

  return function (a, b) {
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
  handleMachineCheckbox,
  machines,
  selectedMachines,
  setActiveRow,
  showMAC,
}) => {
  const sortedMachines = [...machines].sort(machineSort(currentSort));
  return sortedMachines.map((row) => {
    const isActive = activeRow === row.system_id;
    const onToggleMenu = (open) => {
      if (open && !activeRow) {
        setActiveRow(row.system_id);
      } else if (!open || (open && activeRow)) {
        setActiveRow(null);
      }
    };

    return {
      key: row.system_id,
      className: classNames("machine-list__machine", {
        "machine-list__machine--active": isActive,
      }),
      columns: [
        {
          content: (
            <NameColumn
              handleCheckbox={handleMachineCheckbox}
              onToggleMenu={onToggleMenu}
              selected={selectedMachines.includes(row)}
              showMAC={showMAC}
              systemId={row.system_id}
            />
          ),
        },
        {
          content: (
            <PowerColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <StatusColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          ),
        },
        {
          content: (
            <OwnerColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <PoolColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <ZoneColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <FabricColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          ),
        },
        {
          content: (
            <CoresColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <RamColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <DisksColumn onToggleMenu={onToggleMenu} systemId={row.system_id} />
          ),
        },
        {
          content: (
            <StorageColumn
              onToggleMenu={onToggleMenu}
              systemId={row.system_id}
            />
          ),
        },
      ],
    };
  });
};

const generateGroups = (grouping, machines) => {
  if (grouping === "owner") {
    const groupMap = groupAsMap(machines, (machine) => machine.owner);
    return Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No owner", machines }))
      .sort(simpleSortByKey("label"));
  }

  if (grouping === "pool") {
    const groupMap = groupAsMap(machines, (machine) => machine.pool.name);
    return Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No pool", machines }))
      .sort(simpleSortByKey("label"));
  }

  if (grouping === "power_state") {
    const groupMap = groupAsMap(machines, (machine) => machine.power_state);
    return [
      {
        label: "Error",
        machines: groupMap.get("error") || [],
      },
      {
        label: "Off",
        machines: groupMap.get("off") || [],
      },
      {
        label: "On",
        machines: groupMap.get("on") || [],
      },
      {
        label: "Unknown",
        machines: groupMap.get("unknown") || [],
      },
    ].filter((group) => group.machines.length);
  }

  if (grouping === "status") {
    const groupMap = groupAsMap(machines, (machine) => machine.status_code);
    return [
      {
        label: "Failed",
        machines: [
          ...(groupMap.get(nodeStatus.FAILED_COMMISSIONING) || []),
          ...(groupMap.get(nodeStatus.FAILED_DEPLOYMENT) || []),
          ...(groupMap.get(nodeStatus.FAILED_DISK_ERASING) || []),
          ...(groupMap.get(nodeStatus.FAILED_ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.FAILED_EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.FAILED_RELEASING) || []),
          ...(groupMap.get(nodeStatus.FAILED_TESTING) || []),
        ],
      },
      {
        label: "New",
        machines: groupMap.get(nodeStatus.NEW) || [],
      },
      {
        label: "Commissioning",
        machines: groupMap.get(nodeStatus.COMMISSIONING) || [],
      },
      {
        label: "Testing",
        machines: groupMap.get(nodeStatus.TESTING) || [],
      },
      {
        label: "Ready",
        machines: groupMap.get(nodeStatus.READY) || [],
      },
      {
        label: "Allocated",
        machines: groupMap.get(nodeStatus.ALLOCATED) || [],
      },
      {
        label: "Deploying",
        machines: groupMap.get(nodeStatus.DEPLOYING) || [],
      },
      {
        label: "Deployed",
        machines: groupMap.get(nodeStatus.DEPLOYED) || [],
      },
      {
        label: "Rescue mode",
        machines: [
          ...(groupMap.get(nodeStatus.ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(nodeStatus.RESCUE_MODE) || []),
        ],
      },
      {
        label: "Releasing",
        machines: [
          ...(groupMap.get(nodeStatus.DISK_ERASING) || []),
          ...(groupMap.get(nodeStatus.RELEASING) || []),
        ],
      },
      {
        label: "Broken",
        machines: groupMap.get(nodeStatus.BROKEN) || [],
      },
      {
        label: "Other",
        machines: [
          ...(groupMap.get(nodeStatus.MISSING) || []),
          ...(groupMap.get(nodeStatus.RESERVED) || []),
          ...(groupMap.get(nodeStatus.RETIRED) || []),
        ],
      },
    ].filter((group) => group.machines.length);
  }

  if (grouping === "zone") {
    const groupMap = groupAsMap(machines, (machine) => machine.zone.name);
    return Array.from(groupMap)
      .map(([label, machines]) => ({ label: label || "No zone", machines }))
      .sort(simpleSortByKey("label"));
  }

  return {
    label: "No grouping",
    machines,
  };
};

const generateGroupRows = ({
  groups,
  handleGroupCheckbox,
  hiddenGroups,
  selectedMachines,
  setHiddenGroups,
  ...rowProps
}) => {
  let rows = [];

  groups.length &&
    groups.forEach((group) => {
      const { label, machines } = group;
      const collapsed = hiddenGroups.includes(label);
      rows.push({
        className: "machine-list__group",
        columns: [
          {
            content: (
              <DoubleRow
                data-test="group-cell"
                primary={
                  <Input
                    checked={checkboxChecked(machines, selectedMachines)}
                    className="has-inline-label"
                    disabled={false}
                    id={label}
                    label={<strong>{label}</strong>}
                    onChange={() => handleGroupCheckbox(group)}
                    type="checkbox"
                    wrapperClassName="u-no-margin--bottom"
                  />
                }
                primaryTextClassName="u-nudge--checkbox"
                secondary={getGroupSecondaryString(machines, selectedMachines)}
                secondaryClassName="u-nudge--secondary-row"
              />
            ),
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
            content: (
              <div className="machine-list__group-toggle">
                <Button
                  appearance="base"
                  dense
                  hasIcon
                  onClick={() => {
                    if (collapsed) {
                      setHiddenGroups(
                        hiddenGroups.filter((group) => group !== label)
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
              </div>
            ),
          },
        ],
      });
      const visibleMachines = collapsed ? [] : machines;
      rows = rows.concat(
        generateRows({
          machines: visibleMachines,
          selectedMachines,
          ...rowProps,
        })
      );
    });
  return rows;
};

const MachineListTable = ({
  filter,
  grouping,
  hiddenGroups,
  setHiddenGroups,
}) => {
  const dispatch = useDispatch();
  const selectedMachines = useSelector(machineSelectors.selected);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const machines = useSelector((state) =>
    machineSelectors.search(state, filter, selectedIDs)
  );

  const [currentSort, setCurrentSort] = useState({
    key: "fqdn",
    direction: "descending",
  });
  const [activeRow, setActiveRow] = useState(null);
  const [showMAC, setShowMAC] = useState(false);
  const groups = useMemo(() => generateGroups(grouping, machines), [
    grouping,
    machines,
  ]);

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
  }, [dispatch]);

  // Update sort parameters depending on whether the same sort key was clicked.
  const updateSort = (newSortKey) => {
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

  const handleMachineCheckbox = (machine) => {
    let newSelectedMachines;
    if (selectedMachines.includes(machine)) {
      newSelectedMachines = selectedMachines.filter((m) => m !== machine);
    } else {
      newSelectedMachines = [...selectedMachines, machine];
    }
    dispatch(machineActions.setSelected(newSelectedMachines));
  };

  const handleGroupCheckbox = (group) => {
    let newSelectedMachines;
    if (checkboxChecked(group.machines, selectedMachines)) {
      // Unselect all machines in the group if all selected
      newSelectedMachines = group.machines.reduce(
        (acc, machine) => {
          if (acc.includes(machine)) {
            return acc.filter((m) => m !== machine);
          }
          return acc;
        },
        [...selectedMachines]
      );
    } else {
      // Select all machines if at least one not selected
      newSelectedMachines = group.machines.reduce(
        (acc, machine) => {
          if (!acc.includes(machine)) {
            return [...acc, machine];
          }
          return acc;
        },
        [...selectedMachines]
      );
    }
    dispatch(machineActions.setSelected(newSelectedMachines));
  };

  const handleAllCheckbox = () => {
    let newSelectedMachines;
    if (checkboxChecked(machines, selectedMachines)) {
      newSelectedMachines = [];
    } else {
      newSelectedMachines = machines;
    }
    dispatch(machineActions.setSelected(newSelectedMachines));
  };

  const rowProps = {
    activeRow,
    currentSort,
    handleMachineCheckbox,
    setActiveRow,
    showMAC,
  };

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className={classNames("p-table-expanding--light", "machine-list", {
            "machine-list--grouped": grouping !== "none",
          })}
          headers={[
            {
              content: (
                <div className="u-equal-height u-nudge--checkbox">
                  <Input
                    checked={
                      checkboxChecked(machines, selectedMachines) &&
                      machines.length !== 0
                    }
                    className="has-inline-label"
                    data-test="all-machines-checkbox"
                    disabled={machines.length === 0}
                    id="all-machines-checkbox"
                    label={" "}
                    onChange={() => handleAllCheckbox()}
                    type="checkbox"
                    wrapperClassName="u-no-margin--bottom"
                  />
                  <div>
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
                  </div>
                </div>
              ),
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
              ),
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
              ),
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
                    Pool
                  </TableHeader>
                  <TableHeader>Note</TableHeader>
                </>
              ),
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
              ),
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
              ),
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
              className: "u-align--right",
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
              className: "u-align--right",
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
              className: "u-align--right",
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
              className: "u-align--right",
            },
          ]}
          paginate={200}
          rows={
            grouping === "none"
              ? generateRows({ machines, selectedMachines, ...rowProps })
              : generateGroupRows({
                  groups,
                  handleGroupCheckbox,
                  hiddenGroups,
                  selectedMachines,
                  setHiddenGroups,
                  ...rowProps,
                })
          }
        />
        {filter && machines.length === 0 ? (
          <Strip rowClassName="u-align--center">
            <span>No machines match the search criteria.</span>
          </Strip>
        ) : null}
      </Col>
    </Row>
  );
};

MachineListTable.propTypes = {
  grouping: PropTypes.string,
  hiddenGroups: PropTypes.arrayOf(PropTypes.string),
  filter: PropTypes.string,
  setHiddenGroups: PropTypes.func,
};

export default MachineListTable;
