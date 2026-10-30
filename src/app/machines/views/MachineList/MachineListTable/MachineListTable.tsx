import { useMemo, memo, useCallback, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { Select } from "@canonical/react-components";
import type {
  Column,
  Header,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useSelector } from "react-redux";

import MachineListPagination from "./MachineListPagination";
import type { MachineListTableProps, MachineTableRow } from "./types";
import useMachinesTableColumns from "./useMachinesTableColumns/useMachinesTableColumns";
import { generateMachineTableRows } from "./utils";

import { useFetchActions } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import { groupOptions, MachineColumns } from "@/app/machines/constants";
import { generalActions } from "@/app/store/general";
import machineSelectors from "@/app/store/machine/selectors";
import { FilterMachines, useFetchedCount } from "@/app/store/machine/utils";
import { tagActions } from "@/app/store/tag";
import { generateEmptyStateMsg, getTableStatus } from "@/app/utils";

export enum Label {
  EmptyList = "No machines available.",
  Loading = "Loading machines",
  Machines = "Machines",
  NoResults = "No machines match the search criteria.",
}

export const PAGE_SIZES = [50, 100, 200];

// The checkbox column GenericTable adds when it is given a selection. The
// machine list renders its own checkboxes, so this column is never shown.
const GENERIC_TABLE_SELECT_COLUMN = "p-generic-table__select";

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
  totalPages,
}: MachineListTableProps): React.ReactElement => {
  const parsedFilter = useMemo(
    () => FilterMachines.parseFetchFilters(filter),
    [filter]
  );
  const [showMAC, setShowMAC] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  // Keep showing the previous counts while the next page is being fetched.
  const count = useFetchedCount(machineCount, machinesLoading);
  const pageMachineCount = useFetchedCount(
    machinesLoading ? null : machines.length,
    machinesLoading
  );

  useFetchActions([
    generalActions.fetchArchitectures,
    generalActions.fetchDefaultMinHweKernel,
    generalActions.fetchHweKernels,
    generalActions.fetchMachineActions,
    generalActions.fetchOsInfo,
    generalActions.fetchPowerTypes,
    generalActions.fetchVersion,
    tagActions.fetch,
  ]);

  const currentSort = useMemo(
    () => ({ direction: sortDirection, key: sortKey }),
    [sortDirection, sortKey]
  );

  const updateSort = useCallback(
    (newSortKey: MachineListTableProps["sortKey"]) => {
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
    },
    [setSortDirection, setSortKey, sortDirection, sortKey]
  );

  const columns = useMachinesTableColumns({
    callId,
    currentSort,
    filter: parsedFilter,
    grouping,
    hiddenGroups,
    setHiddenGroups,
    setShowFullName,
    setShowMAC,
    showActions,
    showFullName,
    showMAC,
    updateSort,
  });

  const rows = useMemo(
    () => generateMachineTableRows({ grouping, groups, machines }),
    [grouping, groups, machines]
  );

  // GenericTable marks every row as unselected unless it is given the
  // selection, so mirror the checked state of the machine and group
  // checkboxes, which manage the selection in Redux.
  const selected = useSelector(machineSelectors.selected);
  const selection = useMemo(() => {
    const rowSelection: RowSelectionState = {};
    const allSelected = !!selected && "filter" in selected;
    const selectedGroups =
      selected && "groups" in selected ? (selected.groups ?? []) : [];
    const selectedItems =
      selected && "items" in selected ? (selected.items ?? []) : [];
    rows.forEach((row) => {
      const isSelected =
        row.type === "group"
          ? // Collapsed groups are selected by value, expanded groups by
            // selecting all of their machines.
            selectedGroups.includes(row.group.value) ||
            (row.group.items.length > 0 &&
              row.group.items.every((item) => selectedItems.includes(item)))
          : (row.groupValue !== null &&
              selectedGroups.includes(row.groupValue)) ||
            selectedItems.includes(row.systemId);
      if (allSelected || isSelected) {
        rowSelection[row.id] = true;
      }
    });
    return { rowSelection };
  }, [rows, selected]);

  // The FQDN column is never hidden when actions are shown, as it contains
  // the selection checkboxes.
  const isColumnVisible = useCallback(
    (columnId: string) =>
      columnId !== GENERIC_TABLE_SELECT_COLUMN &&
      (!hiddenColumns.includes(columnId) ||
        (columnId === MachineColumns.FQDN && showActions)),
    [hiddenColumns, showActions]
  );

  const filterHeaders = useCallback(
    (header: Header<MachineTableRow, unknown>) =>
      isColumnVisible(header.column.id),
    [isColumnVisible]
  );

  const filterCells = useCallback(
    (row: Row<MachineTableRow>, column: Column<MachineTableRow>) =>
      // Skeleton rows are passed without `original`.
      row.original?.type === "group"
        ? column.id === MachineColumns.FQDN
        : isColumnVisible(column.id),
    [isColumnVisible]
  );

  const groupByStatus = useMemo(
    () => groupOptions.find(({ value }) => value === grouping)?.label ?? "",
    [grouping]
  );

  const tableStatus = getTableStatus({
    isLoading: !!machinesLoading,
    hasFilter: !!filter,
  });

  return (
    <>
      {/* GenericTable's built-in pagination derives the page count from the
          machine count, which includes machines in collapsed groups that the
          server excludes from its pages. This bar mirrors GenericTable's
          markup but uses the server's page count and debounces typed page
          numbers. Replace it once GenericTable accepts a separate page count. */}
      {count > 0 ? (
        <section
          aria-label="Table controls"
          className="machine-list__controls controls-bar u-flex u-flex--justify-between u-flex--wrap"
        >
          <div className="p-form p-form--inline">
            <strong className="controls-bar__description">
              Showing {pageMachineCount} out of {count} machines
            </strong>
            <div className="u-flex u-flex--wrap u-flex--column-x-small controls-bar__right">
              <MachineListPagination
                currentPage={currentPage}
                itemsPerPage={pageSize}
                machineCount={machineCount}
                machinesLoading={machinesLoading}
                paginate={setCurrentPage}
                totalPages={totalPages}
              />
              <Select
                aria-label="Items per page"
                className="u-no-margin--bottom"
                name="Items per page"
                onChange={(event) => {
                  setCurrentPage(1);
                  setPageSize?.(Number(event.target.value));
                }}
                options={PAGE_SIZES.map((size) => ({
                  label: `${size}/page`,
                  value: size,
                }))}
                value={pageSize}
              />
            </div>
          </div>
        </section>
      ) : null}
      <GenericTable<MachineTableRow>
        aria-label={
          machinesLoading
            ? Label.Loading
            : `${Label.Machines} - ${groupByStatus}`
        }
        className={classNames("machine-list", {
          "machine-list--grouped": grouping,
          "machine-list--loading": machinesLoading,
        })}
        columns={columns}
        data={rows}
        filterCells={filterCells}
        filterHeaders={filterHeaders}
        isLoading={!!machinesLoading}
        loadingVariant="skeleton"
        noData={generateEmptyStateMsg(tableStatus, {
          default: Label.EmptyList,
          filtered: Label.NoResults,
        })}
        selection={selection}
        skeletonRowCount={5}
        variant="regular"
      />
    </>
  );
};

export default memo(MachineListTable);
