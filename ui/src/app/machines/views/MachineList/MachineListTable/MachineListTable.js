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
import { actions as resourcePoolActions } from "app/store/resourcepool";
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

/**
 * Filters columns by hiddenColumns.
 *
 * If showActions is true, the "fqdn" column will not be filtered as action checkboxes
 * share the "fqdn" column.
 * @param {Array} columns - headers or rows
 * @param {string[]} hiddenColumns - columns to hide, e.g. ["zone"]
 * @param {bool} showActions - whether actions and associated checkboxes are displayed
 */
const filterColumns = (columns, hiddenColumns, showActions) => {
  if (hiddenColumns.length === 0) {
    return columns;
  }
  return columns.filter(
    (column) =>
      !hiddenColumns.includes(column.key) ||
      (column.key === "fqdn" && showActions)
  );
};

const generateRows = ({
  activeRow,
  handleRowCheckbox,
  machines,
  onToggleMenu,
  selectedIDs,
  showActions,
  showMAC,
  sortRows,
  hiddenColumns,
}) => {
  const sortedMachines = sortRows(machines);
  const menuCallback = showActions ? onToggleMenu : undefined;
  return sortedMachines.map((row) => {
    const isActive = activeRow === row.system_id;

    const columns = [
      {
        key: "fqdn",
        content: (
          <NameColumn
            data-test="fqdn-column"
            handleCheckbox={
              showActions
                ? () => handleRowCheckbox(row.system_id, selectedIDs)
                : undefined
            }
            selected={someInArray(row.system_id, selectedIDs)}
            showMAC={showMAC}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "power",
        content: (
          <PowerColumn
            data-test="power-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "status",
        content: (
          <StatusColumn
            data-test="status-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "owner",
        content: (
          <OwnerColumn
            data-test="owner-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "pool",
        content: (
          <PoolColumn
            data-test="pool-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "zone",
        content: (
          <ZoneColumn
            data-test="zone-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: "fabric",
        content: (
          <FabricColumn data-test="fabric-column" systemId={row.system_id} />
        ),
      },
      {
        key: "cpu",
        content: (
          <CoresColumn data-test="cpu-column" systemId={row.system_id} />
        ),
      },
      {
        key: "memory",
        content: (
          <RamColumn data-test="memory-column" systemId={row.system_id} />
        ),
      },
      {
        key: "disks",
        content: (
          <DisksColumn data-test="disks-column" systemId={row.system_id} />
        ),
      },
      {
        key: "storage",
        content: (
          <StorageColumn data-test="storage-column" systemId={row.system_id} />
        ),
      },
    ];

    return {
      key: row.system_id,
      className: classNames("machine-list__machine", {
        "machine-list__machine--active": isActive,
      }),
      columns: filterColumns(columns, hiddenColumns, showActions),
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
  showActions,
  hiddenColumns,
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
                  showActions ? (
                    <Input
                      checked={someInArray(machineIDs, selectedIDs)}
                      className={classNames("has-inline-label", {
                        "p-checkbox--mixed": someNotAll(
                          machineIDs,
                          selectedIDs
                        ),
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
                  ) : (
                    <strong>{label}</strong>
                  )
                }
                primaryTextClassName={showActions && "u-nudge--checkbox"}
                secondary={getGroupSecondaryString(machineIDs, selectedIDs)}
                secondaryClassName={showActions && "u-nudge--secondary-row"}
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
          showActions,
          hiddenColumns,
          ...rowProps,
        })
      );
    });
  return rows;
};

export const MachineListTable = ({
  filter = "",
  grouping = "none",
  hiddenGroups = [],
  setHiddenGroups,
  setSearchFilter,
  showActions = true,
  hiddenColumns = [],
  paginateLimit = 50,
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
    setSearchFilter && setSearchFilter(filtersToString(newFilters));
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
    showActions,
    showMAC,
    sortRows,
  };

  const headers = [
    {
      key: "fqdn",
      content: (
        <div
          className={classNames("u-flex", {
            "u-nudge--checkbox": showActions,
          })}
        >
          {showActions && (
            <Input
              checked={someInArray(machineIDs, selectedIDs)}
              className={classNames("has-inline-label", {
                "p-checkbox--mixed": someNotAll(machineIDs, selectedIDs),
              })}
              data-test="all-machines-checkbox"
              disabled={machines.length === 0}
              id="all-machines-checkbox"
              label={" "}
              onChange={() => handleGroupCheckbox(machineIDs, selectedIDs)}
              type="checkbox"
              wrapperClassName="u-no-margin--bottom"
            />
          )}
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
      key: "power",
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
      key: "status",
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
      key: "owner",
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
      key: "pool",
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
      key: "zone",
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
      key: "fabric",
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
      key: "cpu",
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
      key: "memory",
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
      key: "disks",
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
      key: "storage",
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
  ];

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className={classNames("p-table-expanding--light", "machine-list", {
            "machine-list--grouped": grouping !== "none",
          })}
          headers={filterColumns(headers, hiddenColumns, showActions)}
          paginate={paginateLimit}
          rows={
            grouping === "none"
              ? generateRows({
                  machines,
                  selectedIDs,
                  hiddenColumns,
                  ...rowProps,
                })
              : generateGroupRows({
                  groups,
                  handleGroupCheckbox,
                  hiddenGroups,
                  selectedIDs,
                  setHiddenGroups,
                  hiddenColumns,
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
  setSearchFilter: PropTypes.func,
  showActions: PropTypes.bool,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
  paginateLimit: PropTypes.number,
};

export default React.memo(MachineListTable);
