import type { ReactNode } from "react";
import { useMemo, memo, useCallback, useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { Button, MainTable } from "@canonical/react-components";
import type {
  MainTableCell,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import classNames from "classnames";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";

import AllCheckbox from "./AllCheckbox";
import CoresColumn from "./CoresColumn";
import DisksColumn from "./DisksColumn";
import FabricColumn from "./FabricColumn";
import GroupCheckbox from "./GroupCheckbox";
import MachineListDisplayCount from "./MachineListDisplayCount";
import MachineListPagination from "./MachineListPagination";
import MachineListSelectedCount from "./MachineListSelectedCount/MachineListSelectedCount";
import NameColumn from "./NameColumn";
import OwnerColumn from "./OwnerColumn";
import PageSizeSelect from "./PageSizeSelect";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RamColumn from "./RamColumn";
import StatusColumn from "./StatusColumn";
import StorageColumn from "./StorageColumn";
import ZoneColumn from "./ZoneColumn";

import DoubleRow from "app/base/components/DoubleRow";
import Placeholder from "app/base/components/Placeholder";
import TableHeader from "app/base/components/TableHeader";
import { useSendAnalytics } from "app/base/hooks";
import { SortDirection } from "app/base/types";
import { columnLabels, columns, MachineColumns } from "app/machines/constants";
import type { GetMachineMenuToggleHandler } from "app/machines/types";
import { actions as generalActions } from "app/store/general";
import type { Machine, MachineStateListGroup } from "app/store/machine/types";
import { FetchGroupKey } from "app/store/machine/types";
import { FilterMachines } from "app/store/machine/utils";
import { useMachineSelectedCount } from "app/store/machine/utils/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import { actions as tagActions } from "app/store/tag";
import { actions as userActions } from "app/store/user";
import { actions as zoneActions } from "app/store/zone";

export enum Label {
  HideGroup = "Hide",
  Loading = "Loading machines",
  Machines = "Machines",
  NoResults = "No machines match the search criteria.",
  ShowGroup = "Show",
}

type Props = {
  callId?: string | null;
  currentPage: number;
  filter?: string;
  grouping?: FetchGroupKey | null;
  groups: MachineStateListGroup[] | null;
  hiddenColumns?: string[];
  hiddenGroups?: (string | null)[];
  machineCount: number | null;
  machines: Machine[];
  machinesLoading?: boolean | null;
  pageSize: number;
  setCurrentPage: (currentPage: number) => void;
  setHiddenGroups?: (hiddenGroups: (string | null)[]) => void;
  setPageSize?: (pageSize: number) => void;
  showActions?: boolean;
  sortDirection: ValueOf<typeof SortDirection>;
  sortKey: FetchGroupKey | null;
  setSortDirection: (sortDirection: ValueOf<typeof SortDirection>) => void;
  setSortKey: (sortKey: FetchGroupKey | null) => void;
};

type TableColumn = MainTableCell & { key: string };

type GenerateRowParams = {
  callId?: string | null;
  groupValue: MachineStateListGroup["value"];
  hiddenColumns: NonNullable<Props["hiddenColumns"]>;
  machines: Machine[];
  getToggleHandler: GetMachineMenuToggleHandler;
  showActions: Props["showActions"];
  showMAC: boolean;
  showFullName: boolean;
};

type RowContent = {
  [MachineColumns.FQDN]: ReactNode;
  [MachineColumns.POWER]: ReactNode;
  [MachineColumns.STATUS]: ReactNode;
  [MachineColumns.OWNER]: ReactNode;
  [MachineColumns.POOL]: ReactNode;
  [MachineColumns.ZONE]: ReactNode;
  [MachineColumns.FABRIC]: ReactNode;
  [MachineColumns.CPU]: ReactNode;
  [MachineColumns.MEMORY]: ReactNode;
  [MachineColumns.DISKS]: ReactNode;
  [MachineColumns.STORAGE]: ReactNode;
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

const generateRow = ({
  key,
  content,
  hiddenColumns,
  showActions,
  classes,
}: {
  key: string | number;
  content: RowContent;
  hiddenColumns: NonNullable<Props["hiddenColumns"]>;
  showActions: GenerateRowParams["showActions"];
  classes?: string;
}) => {
  const columns = [
    {
      "aria-label": columnLabels[MachineColumns.FQDN],
      key: MachineColumns.FQDN,
      className: "fqdn-col",
      content: content[MachineColumns.FQDN],
    },
    {
      "aria-label": columnLabels[MachineColumns.POWER],
      key: MachineColumns.POWER,
      className: "power-col",
      content: content[MachineColumns.POWER],
    },
    {
      "aria-label": columnLabels[MachineColumns.STATUS],
      key: MachineColumns.STATUS,
      className: "status-col",
      content: content[MachineColumns.STATUS],
    },
    {
      "aria-label": columnLabels[MachineColumns.OWNER],
      key: MachineColumns.OWNER,
      className: "owner-col",
      content: content[MachineColumns.OWNER],
    },
    {
      "aria-label": columnLabels[MachineColumns.POOL],
      key: MachineColumns.POOL,
      className: "pool-col",
      content: content[MachineColumns.POOL],
    },
    {
      "aria-label": columnLabels[MachineColumns.ZONE],
      key: MachineColumns.ZONE,
      className: "zone-col",
      content: content[MachineColumns.ZONE],
    },
    {
      "aria-label": columnLabels[MachineColumns.FABRIC],
      key: MachineColumns.FABRIC,
      className: "fabric-col",
      content: content[MachineColumns.FABRIC],
    },
    {
      "aria-label": columnLabels[MachineColumns.CPU],
      key: MachineColumns.CPU,
      className: "cores-col",
      content: content[MachineColumns.CPU],
    },
    {
      "aria-label": columnLabels[MachineColumns.MEMORY],
      key: MachineColumns.MEMORY,
      className: "ram-col",
      content: content[MachineColumns.MEMORY],
    },
    {
      "aria-label": columnLabels[MachineColumns.DISKS],
      key: MachineColumns.DISKS,
      className: "disks-col",
      content: content[MachineColumns.DISKS],
    },
    {
      "aria-label": columnLabels[MachineColumns.STORAGE],
      key: MachineColumns.STORAGE,
      className: "storage-col",
      content: content[MachineColumns.STORAGE],
    },
  ];

  return {
    key,
    className: classNames(
      "machine-list__machine",
      {
        "truncated-border": showActions,
      },
      classes
    ),
    columns: filterColumns(columns, hiddenColumns, showActions),
  };
};

const generateSkeletonRows = (
  hiddenColumns: NonNullable<Props["hiddenColumns"]>,
  showActions: GenerateRowParams["showActions"]
) => {
  return Array.from(Array(5)).map((_, i) => {
    const content = {
      [MachineColumns.FQDN]: (
        <DoubleRow
          primary={<Placeholder>xxxxxxxxx.xxxx</Placeholder>}
          secondary={<Placeholder>xxx.xxx.xx.x</Placeholder>}
        />
      ),
      [MachineColumns.POWER]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxxxxxx</Placeholder>}
          secondary={<Placeholder>Xxxxxxx</Placeholder>}
        />
      ),
      [MachineColumns.STATUS]: (
        <DoubleRow primary={<Placeholder>XXXXX XXXXX</Placeholder>} />
      ),
      [MachineColumns.OWNER]: (
        <DoubleRow
          primary={<Placeholder>Xxxx</Placeholder>}
          secondary={<Placeholder>XXXX, XXX</Placeholder>}
        />
      ),
      [MachineColumns.POOL]: (
        <DoubleRow primary={<Placeholder>Xxxxx</Placeholder>} />
      ),
      [MachineColumns.ZONE]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxx</Placeholder>}
          secondary={<Placeholder>Xxxxxxx</Placeholder>}
        />
      ),
      [MachineColumns.FABRIC]: (
        <DoubleRow
          primary={<Placeholder>Xxxxxxx-X</Placeholder>}
          secondary={<Placeholder>Xxxxx</Placeholder>}
        />
      ),
      [MachineColumns.CPU]: (
        <DoubleRow
          primary={<Placeholder>XX</Placeholder>}
          primaryClassName="u-align--right"
          secondary={<Placeholder>xxxXX</Placeholder>}
          secondaryClassName="u-align--right"
        />
      ),
      [MachineColumns.MEMORY]: (
        <DoubleRow
          primary={<Placeholder>XX xxx</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
      [MachineColumns.DISKS]: (
        <DoubleRow
          primary={<Placeholder>XX</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
      [MachineColumns.STORAGE]: (
        <DoubleRow
          primary={<Placeholder>X.XX</Placeholder>}
          primaryClassName="u-align--right"
        />
      ),
    };
    return generateRow({
      key: i,
      content,
      hiddenColumns,
      showActions,
      classes: "machine-list__machine--inactive",
    });
  });
};
const generateRows = ({
  callId,
  groupValue,
  hiddenColumns,
  machines,
  getToggleHandler,
  showActions,
  showMAC,
  showFullName,
}: GenerateRowParams) => {
  const getMenuHandler: GetMachineMenuToggleHandler = (...args) =>
    showActions ? getToggleHandler(...args) : () => undefined;

  return machines.map((row) => {
    const content = {
      [MachineColumns.FQDN]: (
        <NameColumn
          callId={callId}
          data-testid="fqdn-column"
          groupValue={groupValue}
          machines={machines}
          showActions={showActions}
          showMAC={showMAC}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.POWER]: (
        <PowerColumn
          data-testid="power-column"
          onToggleMenu={getMenuHandler(MachineColumns.POWER)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.STATUS]: (
        <StatusColumn
          data-testid="status-column"
          onToggleMenu={getMenuHandler(MachineColumns.STATUS)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.OWNER]: (
        <OwnerColumn
          data-testid="owner-column"
          onToggleMenu={getMenuHandler(MachineColumns.OWNER)}
          showFullName={showFullName}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.POOL]: (
        <PoolColumn
          data-testid="pool-column"
          onToggleMenu={getMenuHandler(MachineColumns.POOL)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.ZONE]: (
        <ZoneColumn
          data-testid="zone-column"
          onToggleMenu={getMenuHandler(MachineColumns.ZONE)}
          systemId={row.system_id}
        />
      ),
      [MachineColumns.FABRIC]: (
        <FabricColumn data-testid="fabric-column" systemId={row.system_id} />
      ),
      [MachineColumns.CPU]: (
        <CoresColumn data-testid="cpu-column" systemId={row.system_id} />
      ),
      [MachineColumns.MEMORY]: (
        <RamColumn data-testid="memory-column" systemId={row.system_id} />
      ),
      [MachineColumns.DISKS]: (
        <DisksColumn data-testid="disks-column" systemId={row.system_id} />
      ),
      [MachineColumns.STORAGE]: (
        <StorageColumn data-testid="storage-column" systemId={row.system_id} />
      ),
    };
    return generateRow({
      key: row.system_id,
      content,
      hiddenColumns,
      showActions,
    });
  });
};

const generateGroupRows = ({
  callId,
  grouping,
  groups,
  hiddenGroups,
  machines,
  setHiddenGroups,
  showActions,
  hiddenColumns,
  ...rowProps
}: {
  callId?: string | null;
  grouping?: FetchGroupKey | null;
  groups: MachineStateListGroup[] | null;
  hiddenGroups: NonNullable<Props["hiddenGroups"]>;
  setHiddenGroups: Props["setHiddenGroups"];
} & Omit<GenerateRowParams, "groupValue">) => {
  let rows: MainTableRow[] = [];

  groups?.forEach((group) => {
    const { collapsed, count, items: machineIDs, name, value } = group;
    // When the table is set to ungrouped then there are no group headers.
    if (grouping) {
      rows.push({
        "aria-label": `${name} machines group`,
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
                        callId={callId}
                        group={group}
                        groupName={name}
                        grouping={grouping}
                      />
                    ) : (
                      <strong>{name}</strong>
                    )
                  }
                  secondary={pluralize("machine", count, true)}
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
                            hiddenGroups.filter(
                              (hiddenGroup) => hiddenGroup !== value
                            )
                          );
                      } else {
                        setHiddenGroups &&
                          setHiddenGroups(
                            hiddenGroups.concat([value as string])
                          );
                      }
                    }}
                  >
                    {collapsed ? (
                      <i className="p-icon--plus">{Label.ShowGroup}</i>
                    ) : (
                      <i className="p-icon--minus">{Label.HideGroup}</i>
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
        callId,
        groupValue: group.value,
        machines: visibleMachines,
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
  groups,
  grouping,
  hiddenColumns = [],
  hiddenGroups = [],
  machineCount,
  machines,
  machinesLoading,
  pageSize,
  setCurrentPage,
  setHiddenGroups,
  setPageSize,
  showActions = true,
  sortDirection,
  sortKey,
  setSortDirection,
  setSortKey,
  ...props
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const sendAnalytics = useSendAnalytics();
  const { selectedCount } = useMachineSelectedCount();

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
  const [showMAC, setShowMAC] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
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

  const toggleHandler = useCallback(
    (columnName: string, open: boolean) => {
      if (open) {
        sendAnalytics(
          "Machine list",
          "Inline actions open",
          `${columnName} column`
        );
      } else if (!open) {
        sendAnalytics(
          "Machine list",
          "Inline actions close",
          `${columnName} column`
        );
      }
    },
    [sendAnalytics]
  );
  const getToggleHandler = (columnName: string) => (open: boolean) =>
    toggleHandler(columnName, open);

  const rowProps = {
    callId,
    getToggleHandler,
    showActions,
    showMAC,
    showFullName,
  };

  const headers = [
    {
      "aria-label": columnLabels[MachineColumns.FQDN],
      key: MachineColumns.FQDN,
      className: "fqdn-col",
      content: (
        <div className="u-flex">
          {showActions && (
            <AllCheckbox
              callId={callId}
              data-testid="all-machines-checkbox"
              filter={FilterMachines.parseFetchFilters(filter)}
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
            onClick={() => {
              setShowFullName(false);
              updateSort(FetchGroupKey.Owner);
            }}
            sortKey={FetchGroupKey.Owner}
          >
            {columnLabels[MachineColumns.OWNER]}
          </TableHeader>
          &nbsp;<strong>|</strong>&nbsp;
          <TableHeader
            currentSort={currentSort}
            data-testid="owner-name-header"
            onClick={() => {
              sendAnalytics(
                "Machine list",
                "Column header",
                "Show owner full name"
              );
              setShowFullName(true);
            }}
          >
            Name
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
    hiddenGroups,
    machines,
    setHiddenGroups,
    hiddenColumns,
    ...rowProps,
  });

  const skeletonRows = useMemo(
    () => generateSkeletonRows(hiddenColumns, showActions),
    [hiddenColumns, showActions]
  );

  const selectionState =
    selectedCount > 0
      ? [
          {
            className: "select-notification",
            key: "select-info",
            expanded: true,
            expandedContent: (
              <MachineListSelectedCount
                filter={filter}
                machineCount={machineCount}
                selectedCount={selectedCount}
              />
            ),
          },
        ]
      : [];

  return (
    <>
      {machineCount ? (
        <div className="u-flex--between u-flex--align-baseline u-flex--wrap">
          <hr />
          <MachineListDisplayCount
            currentPage={currentPage}
            machineCount={machineCount}
            pageSize={pageSize}
          />
          <span className="u-flex--end">
            <MachineListPagination
              currentPage={currentPage}
              itemsPerPage={pageSize}
              machineCount={machineCount}
              machinesLoading={machinesLoading}
              paginate={setCurrentPage}
            />
            {setPageSize ? (
              <PageSizeSelect
                pageSize={pageSize}
                paginate={setCurrentPage}
                setPageSize={setPageSize}
              />
            ) : null}
          </span>
          <hr />
        </div>
      ) : null}
      <MainTable
        aria-label={machinesLoading ? Label.Loading : Label.Machines}
        className={classNames("p-table-expanding--light", "machine-list", {
          "machine-list--grouped": grouping,
          "machine-list--loading": machinesLoading,
        })}
        emptyStateMsg={!machinesLoading && filter ? Label.NoResults : null}
        expanding={true}
        headers={filterColumns(headers, hiddenColumns, showActions)}
        rows={machinesLoading ? skeletonRows : [...selectionState, ...rows]}
        {...props}
      />
    </>
  );
};

export default memo(MachineListTable);
