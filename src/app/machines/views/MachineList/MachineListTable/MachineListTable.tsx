import { useMemo, memo, useCallback, useState } from "react";

import {
  GenericTable,
  PaginationContainer,
} from "@canonical/maas-react-components";
import { Select } from "@canonical/react-components";
import type { Column, Header, Row } from "@tanstack/react-table";
import classNames from "classnames";

import type { MachineListTableProps, MachineTableRow } from "./types";
import useMachinesTableColumns from "./useMachinesTableColumns/useMachinesTableColumns";
import { generateMachineTableRows } from "./utils";

import { useFetchActions } from "@/app/base/hooks";
import { SortDirection } from "@/app/base/types";
import { groupOptions, MachineColumns } from "@/app/machines/constants";
import { generalActions } from "@/app/store/general";
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
  const pageCount = useFetchedCount(totalPages, machinesLoading);
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

  // The FQDN column is never hidden when actions are shown, as it contains
  // the selection checkboxes.
  const isColumnVisible = useCallback(
    (columnId: string) =>
      !hiddenColumns.includes(columnId) ||
      (columnId === MachineColumns.FQDN && showActions),
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
          markup but uses the server's page count. Replace it once GenericTable
          accepts a separate page count. */}
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
              <PaginationContainer
                currentPage={currentPage}
                disabled={!!machinesLoading}
                paginate={setCurrentPage}
                totalPages={pageCount}
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
        skeletonRowCount={5}
        variant="regular"
      />
    </>
  );
};

export default memo(MachineListTable);
