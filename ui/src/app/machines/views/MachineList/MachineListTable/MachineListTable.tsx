import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { Button, MainTable, Spinner } from "@canonical/react-components";
import type {
  MainTableCell,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";

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

import DoubleRow from "app/base/components/DoubleRow";
import GroupCheckbox from "app/base/components/GroupCheckbox";
import TableHeader from "app/base/components/TableHeader";
import type { TableSort } from "app/base/hooks";
import { useTableSort } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import { columnLabels, columns, MachineColumns } from "app/machines/constants";
import { actions as generalActions } from "app/store/general";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import { actions as tagActions } from "app/store/tag";
import { NodeStatusCode } from "app/store/types/node";
import { actions as userActions } from "app/store/user";
import { actions as zoneActions } from "app/store/zone";
import {
  generateCheckboxHandlers,
  groupAsMap,
  isComparable,
  simpleSortByKey,
} from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

type Props = {
  filter?: string;
  grouping?: string;
  hiddenColumns?: string[];
  hiddenGroups?: string[];
  machines: Machine[];
  paginateLimit?: number;
  selectedIDs?: Machine[MachineMeta.PK][];
  setHiddenGroups?: (hiddenGroups: string[]) => void;
  setSearchFilter?: (filter: string) => void;
  showActions?: boolean;
};

type SortKey = keyof Machine | "fabric";
type TableColumn = MainTableCell & { key: string };

type Group = {
  machines: Machine[];
  label: string;
};

type GenerateRowParams = {
  activeRow: Machine[MachineMeta.PK] | null;
  handleRowCheckbox: CheckboxHandlers<
    Machine[MachineMeta.PK]
  >["handleRowCheckbox"];
  hiddenColumns: NonNullable<Props["hiddenColumns"]>;
  machines: Machine[];
  onToggleMenu: (systemId: Machine[MachineMeta.PK], open: boolean) => void;
  selectedIDs: NonNullable<Props["selectedIDs"]>;
  showActions: Props["showActions"];
  showMAC: boolean;
  sortRows: TableSort<Machine, SortKey>["sortRows"];
};

const getSortValue = (
  sortKey: SortKey,
  machine: Machine
): string | number | null => {
  switch (sortKey) {
    case "domain":
      return machine.domain?.name || null;
    case "pool":
      return machine.pool?.name || null;
    case "zone":
      return machine.zone?.name || null;
    case "fabric":
      return machine.vlan?.fabric_name || null;
  }
  const value = machine[sortKey];
  return isComparable(value) ? value : null;
};

const getGroupSecondaryString = (
  machineIDs: Machine[MachineMeta.PK][],
  selectedIDs: NonNullable<Props["selectedIDs"]>
) => {
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
const filterColumns = (
  columns: TableColumn[],
  hiddenColumns: NonNullable<Props["hiddenColumns"]>,
  showActions: Props["showActions"]
) => {
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
  hiddenColumns,
  machines,
  onToggleMenu,
  selectedIDs,
  showActions,
  showMAC,
  sortRows,
}: GenerateRowParams) => {
  const sortedMachines = sortRows(machines);
  const menuCallback = showActions ? onToggleMenu : undefined;

  return sortedMachines.map((row) => {
    const isActive = activeRow === row.system_id;

    const columns = [
      {
        key: MachineColumns.FQDN,
        className: "fqdn-col",
        content: (
          <NameColumn
            data-testid="fqdn-column"
            handleCheckbox={
              showActions
                ? () => handleRowCheckbox(row.system_id, selectedIDs)
                : undefined
            }
            selected={selectedIDs}
            showMAC={showMAC}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.POWER,
        className: "power-col",
        content: (
          <PowerColumn
            data-testid="power-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.STATUS,
        className: "status-col",
        content: (
          <StatusColumn
            data-testid="status-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.OWNER,
        className: "owner-col",
        content: (
          <OwnerColumn
            data-testid="owner-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.POOL,
        className: "pool-col",
        content: (
          <PoolColumn
            data-testid="pool-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.ZONE,
        className: "zone-col",
        content: (
          <ZoneColumn
            data-testid="zone-column"
            onToggleMenu={menuCallback}
            systemId={row.system_id}
          />
        ),
      },
      {
        key: MachineColumns.FABRIC,
        className: "fabric-col",
        content: (
          <FabricColumn data-testid="fabric-column" systemId={row.system_id} />
        ),
      },
      {
        key: MachineColumns.CPU,
        className: "cores-col",
        content: (
          <CoresColumn data-testid="cpu-column" systemId={row.system_id} />
        ),
      },
      {
        key: MachineColumns.MEMORY,
        className: "ram-col",
        content: (
          <RamColumn data-testid="memory-column" systemId={row.system_id} />
        ),
      },
      {
        key: MachineColumns.DISKS,
        className: "disks-col",
        content: (
          <DisksColumn data-testid="disks-column" systemId={row.system_id} />
        ),
      },
      {
        key: MachineColumns.STORAGE,
        className: "storage-col",
        content: (
          <StorageColumn
            data-testid="storage-column"
            systemId={row.system_id}
          />
        ),
      },
    ];

    return {
      key: row.system_id,
      className: classNames("machine-list__machine", "truncated-border", {
        "machine-list__machine--active": isActive,
      }),
      columns: filterColumns(columns, hiddenColumns, showActions),
    };
  });
};

const generateGroups = (
  grouping: Props["grouping"],
  machines: Machine[]
): Group[] | null => {
  if (grouping === "owner") {
    const groupMap = groupAsMap(machines, (machine) => machine.owner);
    return Array.from(groupMap)
      .map(([label, machines]) => ({
        label: label?.toString() || "No owner",
        machines,
      }))
      .sort(simpleSortByKey("label"));
  }

  if (grouping === "pool") {
    const groupMap = groupAsMap(machines, (machine) => machine.pool.name);
    return Array.from(groupMap)
      .map(([label, machines]) => ({
        label: label?.toString() || "No pool",
        machines,
      }))
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
          ...(groupMap.get(NodeStatusCode.FAILED_COMMISSIONING) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_DEPLOYMENT) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_DISK_ERASING) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_RELEASING) || []),
          ...(groupMap.get(NodeStatusCode.FAILED_TESTING) || []),
        ],
      },
      {
        label: "New",
        machines: groupMap.get(NodeStatusCode.NEW) || [],
      },
      {
        label: "Commissioning",
        machines: groupMap.get(NodeStatusCode.COMMISSIONING) || [],
      },
      {
        label: "Testing",
        machines: groupMap.get(NodeStatusCode.TESTING) || [],
      },
      {
        label: "Ready",
        machines: groupMap.get(NodeStatusCode.READY) || [],
      },
      {
        label: "Allocated",
        machines: groupMap.get(NodeStatusCode.ALLOCATED) || [],
      },
      {
        label: "Deploying",
        machines: groupMap.get(NodeStatusCode.DEPLOYING) || [],
      },
      {
        label: "Deployed",
        machines: groupMap.get(NodeStatusCode.DEPLOYED) || [],
      },
      {
        label: "Rescue mode",
        machines: [
          ...(groupMap.get(NodeStatusCode.ENTERING_RESCUE_MODE) || []),
          ...(groupMap.get(NodeStatusCode.EXITING_RESCUE_MODE) || []),
          ...(groupMap.get(NodeStatusCode.RESCUE_MODE) || []),
        ],
      },
      {
        label: "Releasing",
        machines: [
          ...(groupMap.get(NodeStatusCode.DISK_ERASING) || []),
          ...(groupMap.get(NodeStatusCode.RELEASING) || []),
        ],
      },
      {
        label: "Broken",
        machines: groupMap.get(NodeStatusCode.BROKEN) || [],
      },
      {
        label: "Other",
        machines: [
          ...(groupMap.get(NodeStatusCode.MISSING) || []),
          ...(groupMap.get(NodeStatusCode.RESERVED) || []),
          ...(groupMap.get(NodeStatusCode.RETIRED) || []),
        ],
      },
    ].filter((group) => group.machines.length);
  }

  if (grouping === "zone") {
    const groupMap = groupAsMap(machines, (machine) => machine.zone.name);
    return Array.from(groupMap)
      .map(([label, machines]) => ({
        label: label?.toString() || "No zone",
        machines,
      }))
      .sort(simpleSortByKey("label"));
  }

  return null;
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
}: {
  groups: Group[];
  handleGroupCheckbox: CheckboxHandlers<
    Machine[MachineMeta.PK]
  >["handleGroupCheckbox"];
  hiddenGroups: NonNullable<Props["hiddenGroups"]>;
  setHiddenGroups: Props["setHiddenGroups"];
} & Omit<GenerateRowParams, "machines">) => {
  let rows: MainTableRow[] = [];

  groups.length &&
    groups.forEach((group) => {
      const { label, machines } = group;
      const machineIDs = machines.map((machine) => machine.system_id);
      const collapsed = hiddenGroups.includes(label);
      rows.push({
        className: "machine-list__group",
        columns: [
          {
            colSpan: columns.length - hiddenColumns.length,
            content: (
              <>
                <DoubleRow
                  data-testid="group-cell"
                  primary={
                    showActions ? (
                      <GroupCheckbox
                        inRow
                        items={machineIDs}
                        selectedItems={selectedIDs}
                        handleGroupCheckbox={handleGroupCheckbox}
                        inputLabel={<strong>{label}</strong>}
                      />
                    ) : (
                      <strong>{label}</strong>
                    )
                  }
                  secondary={getGroupSecondaryString(machineIDs, selectedIDs)}
                  secondaryClassName={
                    showActions ? "u-nudge--secondary-row u-align--left" : null
                  }
                />
                <div className="machine-list__group-toggle">
                  <Button
                    appearance="base"
                    dense
                    hasIcon
                    onClick={() => {
                      if (collapsed) {
                        setHiddenGroups &&
                          setHiddenGroups(
                            hiddenGroups.filter((group) => group !== label)
                          );
                      } else {
                        setHiddenGroups &&
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
              </>
            ),
          },
        ],
      });
      const visibleMachines = collapsed ? [] : machines;
      rows = rows.concat(
        generateRows({
          ...rowProps,
          machines: visibleMachines,
          selectedIDs,
          showActions,
          hiddenColumns,
        })
      );
    });
  return rows;
};

export const MachineListTable = ({
  filter = "",
  grouping = "none",
  hiddenColumns = [],
  hiddenGroups = [],
  machines,
  paginateLimit = 50,
  selectedIDs = [],
  setHiddenGroups,
  setSearchFilter,
  showActions = true,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machineIDs = machines.map((machine) => machine.system_id);
  const { currentSort, sortRows, updateSort } = useTableSort<Machine, SortKey>(
    getSortValue,
    {
      key: MachineColumns.FQDN,
      direction: SortDirection.DESCENDING,
    }
  );

  const [activeRow, setActiveRow] = useState<Machine[MachineMeta.PK] | null>(
    null
  );
  const [showMAC, setShowMAC] = useState(false);
  const groups = useMemo(
    () => generateGroups(grouping, machines),
    [grouping, machines]
  );
  const removeSelectedFilter = () => {
    const filters = FilterMachines.getCurrentFilters(filter);
    const newFilters = FilterMachines.toggleFilter(
      filters,
      "in",
      "selected",
      false,
      false
    );
    setSearchFilter &&
      setSearchFilter(FilterMachines.filtersToString(newFilters));
  };

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchMachineActions());
    dispatch(generalActions.fetchOsInfo());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(generalActions.fetchVersion());
    dispatch(resourcePoolActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(userActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  const { handleGroupCheckbox, handleRowCheckbox } = generateCheckboxHandlers<
    Machine[MachineMeta.PK]
  >((machineIDs) => {
    if (machineIDs.length === 0) {
      removeSelectedFilter();
    }
    dispatch(machineActions.setSelected(machineIDs));
  });

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
      key: MachineColumns.FQDN,
      className: "fqdn-col",
      content: (
        <div className="u-flex">
          {showActions && (
            <GroupCheckbox
              items={machineIDs}
              selectedItems={selectedIDs}
              handleGroupCheckbox={handleGroupCheckbox}
              data-testid="all-machines-checkbox"
            />
          )}
          <div>
            <TableHeader
              currentSort={currentSort}
              data-testid="fqdn-header"
              onClick={() => {
                setShowMAC(false);
                updateSort("fqdn");
              }}
              sortKey="fqdn"
            >
              {columnLabels[MachineColumns.FQDN]}
            </TableHeader>
            &nbsp;<strong>|</strong>&nbsp;
            <TableHeader
              currentSort={currentSort}
              data-testid="mac-header"
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
      key: MachineColumns.POWER,
      className: "power-col",
      content: (
        <TableHeader
          className="p-double-row__header-spacer"
          currentSort={currentSort}
          data-testid="power-header"
          onClick={() => updateSort("power_state")}
          sortKey="power_state"
        >
          {columnLabels[MachineColumns.POWER]}
        </TableHeader>
      ),
    },
    {
      key: MachineColumns.STATUS,
      className: "status-col",
      content: (
        <TableHeader
          className="p-double-row__header-spacer"
          currentSort={currentSort}
          data-testid="status-header"
          onClick={() => updateSort("status")}
          sortKey="status"
        >
          {columnLabels[MachineColumns.STATUS]}
        </TableHeader>
      ),
    },
    {
      key: MachineColumns.OWNER,
      className: "owner-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="owner-header"
            onClick={() => updateSort("owner")}
            sortKey="owner"
          >
            {columnLabels[MachineColumns.OWNER]}
          </TableHeader>
          <TableHeader>Tags</TableHeader>
        </>
      ),
    },
    {
      key: MachineColumns.POOL,
      className: "pool-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="pool-header"
            onClick={() => updateSort("pool")}
            sortKey="pool"
          >
            {columnLabels[MachineColumns.POOL]}
          </TableHeader>
          <TableHeader>Note</TableHeader>
        </>
      ),
    },
    {
      key: MachineColumns.ZONE,
      className: "zone-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="zone-header"
            onClick={() => updateSort("zone")}
            sortKey="zone"
          >
            {columnLabels[MachineColumns.ZONE]}
          </TableHeader>
          <TableHeader>Spaces</TableHeader>
        </>
      ),
    },
    {
      key: MachineColumns.FABRIC,
      className: "fabric-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="fabric-header"
            onClick={() => updateSort("fabric")}
            sortKey="fabric"
          >
            {columnLabels[MachineColumns.FABRIC]}
          </TableHeader>
          <TableHeader>VLAN</TableHeader>
        </>
      ),
    },
    {
      key: MachineColumns.CPU,
      className: "cores-col u-align--right",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="cores-header"
            onClick={() => updateSort("cpu_count")}
            sortKey="cpu_count"
          >
            {columnLabels[MachineColumns.CPU]}
          </TableHeader>
          <TableHeader>Arch</TableHeader>
        </>
      ),
    },
    {
      key: MachineColumns.MEMORY,
      className: "ram-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="memory-header"
          onClick={() => updateSort("memory")}
          sortKey="memory"
        >
          {columnLabels[MachineColumns.MEMORY]}
        </TableHeader>
      ),
    },
    {
      key: MachineColumns.DISKS,
      className: "disks-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="disks-header"
          onClick={() => updateSort("physical_disk_count")}
          sortKey="physical_disk_count"
        >
          {columnLabels[MachineColumns.DISKS]}
        </TableHeader>
      ),
    },
    {
      key: MachineColumns.STORAGE,
      className: "storage-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="storage-header"
          onClick={() => updateSort("storage")}
          sortKey="storage"
        >
          {columnLabels[MachineColumns.STORAGE]}
        </TableHeader>
      ),
    },
  ];

  let rows: MainTableRow[] | null = null;

  if (grouping === "none") {
    rows = generateRows({
      machines,
      selectedIDs,
      hiddenColumns,
      ...rowProps,
    });
  } else if (groups) {
    rows = generateGroupRows({
      groups,
      handleGroupCheckbox,
      hiddenGroups,
      selectedIDs,
      setHiddenGroups,
      hiddenColumns,
      ...rowProps,
    });
  }

  return (
    <>
      <MainTable
        className={classNames("p-table-expanding--light", "machine-list", {
          "machine-list--grouped": grouping !== "none",
        })}
        headers={filterColumns(headers, hiddenColumns, showActions)}
        paginate={paginateLimit}
        rows={
          // Pass undefined if there are no rows as the MainTable prop doesn't
          // allow null.
          rows ? rows : undefined
        }
        emptyStateMsg={
          !machinesLoaded ? (
            <Spinner text="Loading..." />
          ) : filter ? (
            "No machines match the search criteria."
          ) : null
        }
      />
    </>
  );
};

export default memo(MachineListTable);
