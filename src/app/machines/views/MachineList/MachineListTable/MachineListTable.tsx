import { useMemo, memo, useCallback, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
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
}: MachineListTableProps): React.ReactElement => {
  const parsedFilter = useMemo(
    () => FilterMachines.parseFetchFilters(filter),
    [filter]
  );
  const [showMAC, setShowMAC] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  // Keep showing the previous count while the next page is being fetched.
  const count = useFetchedCount(machineCount, machinesLoading);

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
    <GenericTable<MachineTableRow>
      aria-label={
        machinesLoading ? Label.Loading : `${Label.Machines} - ${groupByStatus}`
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
      pagination={
        count > 0
          ? {
              currentPage,
              dataContext: "machines",
              handlePageSizeChange: (size: number) => {
                setCurrentPage(1);
                setPageSize?.(size);
              },
              isPending: !!machinesLoading,
              itemsPerPage: pageSize,
              pageSizes: PAGE_SIZES,
              setCurrentPage,
              totalItems: count,
            }
          : undefined
      }
      skeletonRowCount={5}
      variant="regular"
    />
  );
};

export default memo(MachineListTable);
