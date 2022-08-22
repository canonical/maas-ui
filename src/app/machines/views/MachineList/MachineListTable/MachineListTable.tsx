import { memo, useCallback, useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import {
  Button,
  MainTable,
  Pagination,
  Spinner,
} from "@canonical/react-components";
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
import { SortDirection } from "app/base/types";
import { columnLabels, columns, MachineColumns } from "app/machines/constants";
import { actions as generalActions } from "app/store/general";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { FetchGroupKey } from "app/store/machine/types";
import type {
  Machine,
  MachineMeta,
  MachineStateListGroup,
} from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { actions as userActions } from "app/store/user";
import { actions as zoneActions } from "app/store/zone";
import { generateCheckboxHandlers, someInArray } from "app/utils";
import type { CheckboxHandlers } from "app/utils/generateCheckboxHandlers";

export const DEFAULTS = {
  pageSize: 50,
  sortDirection: SortDirection.DESCENDING,
  // TODO: change this to fqdn when the API supports it:
  // https://github.com/canonical/app-tribe/issues/1268
  sortKey: FetchGroupKey.Hostname,
};

export enum Label {
  Pagination = "Table pagination",
}

type Props = {
  callId?: string | null;
  currentPage: number;
  filter?: string;
  grouping?: FetchGroupKey | null;
  hiddenColumns?: string[];
  hiddenGroups?: (string | null)[];
  machineCount: number | null;
  machines: Machine[];
  machinesLoading?: boolean | null;
  pageSize: number;
  selectedIDs?: Machine[MachineMeta.PK][];
  setCurrentPage: (currentPage: number) => void;
  setHiddenGroups?: (hiddenGroups: (string | null)[]) => void;
  setSearchFilter?: (filter: string) => void;
  showActions?: boolean;
  sortDirection: ValueOf<typeof SortDirection>;
  sortKey: FetchGroupKey | null;
  setSortDirection: (sortDirection: ValueOf<typeof SortDirection>) => void;
  setSortKey: (sortKey: FetchGroupKey | null) => void;
};

type TableColumn = MainTableCell & { key: string };

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
}: GenerateRowParams) => {
  const menuCallback = showActions ? onToggleMenu : undefined;

  return machines.map((row) => {
    const isActive = activeRow === row.system_id;

    const columns = [
      {
        "aria-label": columnLabels[MachineColumns.FQDN],
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
        "aria-label": columnLabels[MachineColumns.POWER],
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
        "aria-label": columnLabels[MachineColumns.STATUS],
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
        "aria-label": columnLabels[MachineColumns.OWNER],
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
        "aria-label": columnLabels[MachineColumns.POOL],
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
        "aria-label": columnLabels[MachineColumns.ZONE],
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
        "aria-label": columnLabels[MachineColumns.FABRIC],
        key: MachineColumns.FABRIC,
        className: "fabric-col",
        content: (
          <FabricColumn data-testid="fabric-column" systemId={row.system_id} />
        ),
      },
      {
        "aria-label": columnLabels[MachineColumns.CPU],
        key: MachineColumns.CPU,
        className: "cores-col",
        content: (
          <CoresColumn data-testid="cpu-column" systemId={row.system_id} />
        ),
      },
      {
        "aria-label": columnLabels[MachineColumns.MEMORY],
        key: MachineColumns.MEMORY,
        className: "ram-col",
        content: (
          <RamColumn data-testid="memory-column" systemId={row.system_id} />
        ),
      },
      {
        "aria-label": columnLabels[MachineColumns.DISKS],
        key: MachineColumns.DISKS,
        className: "disks-col",
        content: (
          <DisksColumn data-testid="disks-column" systemId={row.system_id} />
        ),
      },
      {
        "aria-label": columnLabels[MachineColumns.STORAGE],
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
      className: classNames("machine-list__machine", {
        "machine-list__machine--active": isActive,
        "truncated-border": showActions,
      }),
      columns: filterColumns(columns, hiddenColumns, showActions),
    };
  });
};

const generateGroupRows = ({
  grouping,
  groups,
  handleGroupCheckbox,
  hiddenGroups,
  machines,
  selectedIDs,
  setHiddenGroups,
  showActions,
  hiddenColumns,
  ...rowProps
}: {
  grouping?: FetchGroupKey | null;
  groups: MachineStateListGroup[] | null;
  handleGroupCheckbox: CheckboxHandlers<
    Machine[MachineMeta.PK]
  >["handleGroupCheckbox"];
  hiddenGroups: NonNullable<Props["hiddenGroups"]>;
  setHiddenGroups: Props["setHiddenGroups"];
} & GenerateRowParams) => {
  let rows: MainTableRow[] = [];

  groups?.forEach((group) => {
    const { collapsed, items: machineIDs, name } = group;
    // When the table is set to ungrouped then there are no group headers.
    if (grouping) {
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
                        checkAllSelected={(_, selectedIDs) =>
                          machineIDs.every((id) => selectedIDs.includes(id))
                        }
                        checkSelected={(_, selectedIDs) =>
                          someInArray(selectedIDs, machineIDs)
                        }
                        handleGroupCheckbox={handleGroupCheckbox}
                        inRow
                        inputLabel={<strong>{name}</strong>}
                        items={machineIDs}
                        selectedItems={selectedIDs}
                      />
                    ) : (
                      <strong>{name}</strong>
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
                            hiddenGroups.filter((group) => group !== name)
                          );
                      } else {
                        setHiddenGroups &&
                          setHiddenGroups(hiddenGroups.concat([name]));
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
    }
    // Get the machines in this group using the list of machine ids provided by the group.
    const visibleMachines = collapsed
      ? []
      : machineIDs.reduce<Machine[]>((groupMachines, systemId) => {
          const machine = machines.find(
            ({ system_id }) => system_id === systemId
          );
          if (machine) {
            groupMachines.push(machine);
          }
          return groupMachines;
        }, []);
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
  callId,
  currentPage,
  filter = "",
  grouping,
  hiddenColumns = [],
  hiddenGroups = [],
  machineCount,
  machines,
  machinesLoading,
  pageSize,
  selectedIDs = [],
  setCurrentPage,
  setHiddenGroups,
  setSearchFilter,
  showActions = true,
  sortDirection,
  sortKey,
  setSortDirection,
  setSortKey,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const groups = useSelector((state: RootState) =>
    machineSelectors.listGroups(state, callId)
  );
  const machineIDs = machines.map((machine) => machine.system_id);
  const currentSort = {
    direction: sortDirection,
    key: sortKey,
  };
  const updateSort = (newSortKey: Props["sortKey"]) => {
    if (newSortKey === sortKey) {
      if (sortDirection === SortDirection.ASCENDING) {
        setSortKey(null);
        setSortDirection(SortDirection.NONE);
      } else {
        setSortDirection(SortDirection.ASCENDING);
      }
    } else {
      setSortKey(newSortKey);
      setSortDirection(SortDirection.DESCENDING);
    }
  };
  const [activeRow, setActiveRow] = useState<Machine[MachineMeta.PK] | null>(
    null
  );
  const [showMAC, setShowMAC] = useState(false);
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
  };

  const headers = [
    {
      "aria-label": columnLabels[MachineColumns.FQDN],
      key: MachineColumns.FQDN,
      className: "fqdn-col",
      content: (
        <div className="u-flex">
          {showActions && (
            <GroupCheckbox
              data-testid="all-machines-checkbox"
              handleGroupCheckbox={handleGroupCheckbox}
              items={machineIDs}
              selectedItems={selectedIDs}
            />
          )}
          <div>
            <TableHeader
              currentSort={currentSort}
              data-testid="fqdn-header"
              // TODO: change this to "fqdn" when the API supports it:
              // https://github.com/canonical/app-tribe/issues/1268
              onClick={() => {
                setShowMAC(false);
                updateSort(FetchGroupKey.Hostname);
              }}
              sortKey={FetchGroupKey.Hostname}
            >
              {columnLabels[MachineColumns.FQDN]}
            </TableHeader>
            &nbsp;<strong>|</strong>&nbsp;
            <TableHeader
              currentSort={currentSort}
              data-testid="mac-header"
              // TODO: enable sorting by "pxe_mac" when the API supports it:
              // https://github.com/canonical/app-tribe/issues/1268
              onClick={() => {
                setShowMAC(true);
              }}
            >
              MAC
            </TableHeader>
            <TableHeader>IP</TableHeader>
          </div>
        </div>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.POWER],
      key: MachineColumns.POWER,
      className: "power-col",
      content: (
        <TableHeader
          className="p-double-row__header-spacer"
          currentSort={currentSort}
          data-testid="power-header"
          onClick={() => updateSort(FetchGroupKey.PowerState)}
          sortKey={FetchGroupKey.PowerState}
        >
          {columnLabels[MachineColumns.POWER]}
        </TableHeader>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.STATUS],
      key: MachineColumns.STATUS,
      className: "status-col",
      content: (
        <TableHeader
          className="p-double-row__header-spacer"
          currentSort={currentSort}
          data-testid="status-header"
          onClick={() => updateSort(FetchGroupKey.Status)}
          sortKey={FetchGroupKey.Status}
        >
          {columnLabels[MachineColumns.STATUS]}
        </TableHeader>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.OWNER],
      key: MachineColumns.OWNER,
      className: "owner-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="owner-header"
            onClick={() => updateSort(FetchGroupKey.Owner)}
            sortKey={FetchGroupKey.Owner}
          >
            {columnLabels[MachineColumns.OWNER]}
          </TableHeader>
          <TableHeader>Tags</TableHeader>
        </>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.POOL],
      key: MachineColumns.POOL,
      className: "pool-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="pool-header"
            onClick={() => updateSort(FetchGroupKey.Pool)}
            sortKey={FetchGroupKey.Pool}
          >
            {columnLabels[MachineColumns.POOL]}
          </TableHeader>
          <TableHeader>Note</TableHeader>
        </>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.ZONE],
      key: MachineColumns.ZONE,
      className: "zone-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="zone-header"
            onClick={() => updateSort(FetchGroupKey.Zone)}
            sortKey={FetchGroupKey.Zone}
          >
            {columnLabels[MachineColumns.ZONE]}
          </TableHeader>
          <TableHeader>Spaces</TableHeader>
        </>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.FABRIC],
      key: MachineColumns.FABRIC,
      className: "fabric-col",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="fabric-header"
            // TODO: enable sorting by "fabric" when the API supports it:
            // https://github.com/canonical/app-tribe/issues/1268
          >
            {columnLabels[MachineColumns.FABRIC]}
          </TableHeader>
          <TableHeader>VLAN</TableHeader>
        </>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.CPU],
      key: MachineColumns.CPU,
      className: "cores-col u-align--right",
      content: (
        <>
          <TableHeader
            currentSort={currentSort}
            data-testid="cores-header"
            onClick={() => updateSort(FetchGroupKey.CpuCount)}
            sortKey={FetchGroupKey.CpuCount}
          >
            {columnLabels[MachineColumns.CPU]}
          </TableHeader>
          <TableHeader>Arch</TableHeader>
        </>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.MEMORY],
      key: MachineColumns.MEMORY,
      className: "ram-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="memory-header"
          onClick={() => updateSort(FetchGroupKey.Memory)}
          sortKey={FetchGroupKey.Memory}
        >
          {columnLabels[MachineColumns.MEMORY]}
        </TableHeader>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.DISKS],
      key: MachineColumns.DISKS,
      className: "disks-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="disks-header"
          // TODO: enable sorting by "physical_disk_count" when the API supports it:
          // https://github.com/canonical/app-tribe/issues/1268
        >
          {columnLabels[MachineColumns.DISKS]}
        </TableHeader>
      ),
    },
    {
      "aria-label": columnLabels[MachineColumns.STORAGE],
      key: MachineColumns.STORAGE,
      className: "storage-col u-align--right",
      content: (
        <TableHeader
          currentSort={currentSort}
          data-testid="storage-header"
          // TODO: enable sorting by "storage" when the API supports it:
          // https://github.com/canonical/app-tribe/issues/1268
        >
          {columnLabels[MachineColumns.STORAGE]}
        </TableHeader>
      ),
    },
  ];

  const rows = generateGroupRows({
    grouping,
    groups,
    handleGroupCheckbox,
    hiddenGroups,
    machines,
    selectedIDs,
    setHiddenGroups,
    hiddenColumns,
    ...rowProps,
  });

  return (
    <>
      <MainTable
        aria-label="Machines"
        className={classNames("p-table-expanding--light", "machine-list", {
          "machine-list--grouped": grouping,
        })}
        emptyStateMsg={
          machinesLoading ? (
            <Spinner text="Loading..." />
          ) : filter ? (
            "No machines match the search criteria."
          ) : null
        }
        headers={filterColumns(headers, hiddenColumns, showActions)}
        rows={
          // Pass undefined if there are no rows as the MainTable prop doesn't
          // allow null.
          rows ? rows : undefined
        }
        {...props}
      />
      {(machineCount ?? 0) > 0 && (
        <Pagination
          aria-label={Label.Pagination}
          currentPage={currentPage}
          itemsPerPage={pageSize}
          paginate={setCurrentPage}
          style={{ marginTop: "1rem" }}
          totalItems={machineCount ?? 0}
        />
      )}
    </>
  );
};

export default memo(MachineListTable);
