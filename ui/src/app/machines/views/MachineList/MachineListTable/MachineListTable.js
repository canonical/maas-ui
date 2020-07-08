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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import pluralize from "pluralize";

import {
  filtersToString,
  getCurrentFilters,
  toggleFilter,
} from "app/machines/search";
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
import {
  generateCheckboxHandlers,
  groupAsMap,
  simpleSortByKey,
  someInArray,
  someNotAll,
} from "app/utils";
import machineSelectors from "app/store/machine/selectors";
import { nodeStatus } from "app/base/enum";
import { useTableSort } from "app/base/hooks";
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

const getSortValue = (sortKey, machine) => {
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

const getGroupSecondaryString = (machineIDs, selectedIDs) => {
  let string = pluralize("machine", machineIDs.length, true);
  const selectedCount = machineIDs.reduce(
    (sum, machine) => (selectedIDs.includes(machine) ? sum + 1 : sum),
    0
  );

  if (selectedCount) {
    if (selectedCount === machineIDs.length) {
      string = `${string} selected`;
    } else {
      string = `${string}, ${selectedCount} selected`;
    }
  }
  return string;
};

const generateRows = ({
  activeRow,
  handleRowCheckbox,
  machines,
  onToggleMenu,
  selectedIDs,
  showMAC,
  sortRows,
}) => {
  const sortedMachines = sortRows(machines);
  return sortedMachines.map((row) => {
    const isActive = activeRow === row.system_id;

    return {
      key: row.system_id,
      className: classNames("machine-list__machine", {
        "machine-list__machine--active": isActive,
      }),
      columns: [
        {
          content: (
            <NameColumn
              handleCheckbox={() =>
                handleRowCheckbox(row.system_id, selectedIDs)
              }
              selected={someInArray(row.system_id, selectedIDs)}
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
          content: <FabricColumn systemId={row.system_id} />,
        },
        {
          content: <CoresColumn systemId={row.system_id} />,
        },
        {
          content: <RamColumn systemId={row.system_id} />,
        },
        {
          content: <DisksColumn systemId={row.system_id} />,
        },
        {
          content: <StorageColumn systemId={row.system_id} />,
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
  selectedIDs,
  setHiddenGroups,
  ...rowProps
}) => {
  let rows = [];

  groups.length &&
    groups.forEach((group) => {
      const { label, machines } = group;
      const machineIDs = machines.map((machine) => machine.system_id);
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
                    checked={someInArray(machineIDs, selectedIDs)}
                    className={classNames("has-inline-label", {
                      "p-checkbox--mixed": someNotAll(machineIDs, selectedIDs),
                    })}
                    disabled={false}
                    id={label}
                    label={<strong>{label}</strong>}
                    onChange={() =>
                      handleGroupCheckbox(machineIDs, selectedIDs)
                    }
                    type="checkbox"
                    wrapperClassName="u-no-margin--bottom"
                  />
                }
                primaryTextClassName="u-nudge--checkbox"
                secondary={getGroupSecondaryString(machineIDs, selectedIDs)}
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
          selectedIDs,
          ...rowProps,
        })
      );
    });
  return rows;
};

export const MachineListTable = ({
  filter,
  grouping,
  hiddenGroups,
  setHiddenGroups,
  setSearchFilter,
}) => {
  const dispatch = useDispatch();
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const machines = useSelector((state) =>
    machineSelectors.search(state, filter, selectedIDs)
  );
  const machineIDs = machines.map((machine) => machine.system_id);
  const { currentSort, sortRows, updateSort } = useTableSort(getSortValue, {
    key: "fqdn",
    direction: "descending",
  });

  const [activeRow, setActiveRow] = useState(null);
  const [showMAC, setShowMAC] = useState(false);
  const groups = useMemo(() => generateGroups(grouping, machines), [
    grouping,
    machines,
  ]);
  const removeSelectedFilter = () => {
    const filters = getCurrentFilters(filter);
    const newFilters = toggleFilter(filters, "in", "selected", false, false);
    setSearchFilter(filtersToString(newFilters));
  };

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

  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers(
    (machineIDs) => {
      if (machineIDs.length === 0) {
        removeSelectedFilter();
      }
      dispatch(machineActions.setSelected(machineIDs));
    }
  );

  const onToggleMenu = useCallback(
    (systemId, open) => {
      if (open && !activeRow) {
        setActiveRow(systemId);
      } else if (!open || (open && activeRow)) {
        setActiveRow(null);
      }
    },
    [activeRow]
  );

  const rowProps = {
    activeRow,
    handleRowCheckbox,
    onToggleMenu,
    showMAC,
    sortRows,
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
                <div className="u-flex u-nudge--checkbox">
                  <Input
                    checked={someInArray(machineIDs, selectedIDs)}
                    className={classNames("has-inline-label", {
                      "p-checkbox--mixed": someNotAll(machineIDs, selectedIDs),
                    })}
                    data-test="all-machines-checkbox"
                    disabled={machines.length === 0}
                    id="all-machines-checkbox"
                    label={" "}
                    onChange={() =>
                      handleGroupCheckbox(machineIDs, selectedIDs)
                    }
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
          paginate={50}
          rows={
            grouping === "none"
              ? generateRows({ machines, selectedIDs, ...rowProps })
              : generateGroupRows({
                  groups,
                  handleGroupCheckbox,
                  hiddenGroups,
                  selectedIDs,
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
  setSearchFilter: PropTypes.func.isRequired,
};

export default React.memo(MachineListTable);
