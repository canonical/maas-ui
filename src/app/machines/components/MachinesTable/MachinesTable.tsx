import type { ReactElement } from "react";
import { useMemo, useEffect, useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import VaultNotification from "@/app/base/components/VaultNotification";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import ErrorsNotification from "@/app/machines/components/ErrorsNotification";
import useMachinesTableColumns, {
  filterCells,
  filterHeaders,
} from "@/app/machines/components/MachinesTable/useMachinesTableColumns/useMachinesTableColumns";
import type { useResponsiveColumns } from "@/app/machines/views/MachinesList/hooks";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { FetchFilters, Machine } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachines } from "@/app/store/machine/utils/hooks";

import "./index.scss";

type MachinesTableProps = {
  grouping: FetchGroupKey;
  hiddenColumns: ReturnType<typeof useResponsiveColumns>[0];
  hiddenGroups: (string | null)[];
  headerFormOpen?: boolean;
  searchFilter?: FetchFilters;
};

export const SortKeyMapping: Record<string, FetchGroupKey> = {
  hostname: FetchGroupKey.Hostname,
  mac: FetchGroupKey.Hostname,
  power: FetchGroupKey.PowerState,
  status: FetchGroupKey.Status,
  owner: FetchGroupKey.Owner,
  ownerName: FetchGroupKey.Owner,
  pool: FetchGroupKey.Pool,
  zone: FetchGroupKey.Zone,
  cpuCount: FetchGroupKey.CpuCount,
  ram: FetchGroupKey.Memory,
  disks: FetchGroupKey.PhysicalDiskCount,
  storage: FetchGroupKey.TotalStorage,
};

const MachinesTable = ({
  grouping,
  hiddenColumns,
  hiddenGroups,
  headerFormOpen,
  searchFilter,
}: MachinesTableProps): ReactElement => {
  const dispatch = useDispatch();
  const { page, size, handlePageSizeChange, setPage } = usePagination();
  const errors = useSelector(machineSelectors.errors);

  const [sorting, setSorting] = useState<SortingState>([
    { id: grouping, desc: false },
  ]);

  useEffect(() => {
    setSorting([{ id: grouping, desc: false }]);
  }, [grouping]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { callId, groups, loading, machineCount, machines, machinesErrors } =
    useFetchMachines({
      collapsedGroups: hiddenGroups,
      filters: searchFilter,
      grouping,
      sortDirection: sorting.length
        ? sorting[0].desc
          ? "descending"
          : "ascending"
        : "none",
      sortKey: sorting.length ? SortKeyMapping[sorting[0].id] : null,
      pagination: {
        currentPage: page,
        setCurrentPage: setPage,
        pageSize: size,
      },
    });

  // TODO: the grouping and sorting in-table has a race condition with the redux store fetching, try fixing with v3
  const activeGroupBy = useMemo<string[]>(() => {
    // Don't group while loading or if no groups exist
    if (loading || !groups || groups.length === 0) {
      return [];
    }

    // Extract all valid group names
    const groupNames = groups.map((g) => g.name);

    // Check that every machine's groupField matches one of the group names
    const hasMatchingGrouping = machines.every((machine) => {
      const value = machine[grouping as keyof Machine];
      const groupField =
        typeof value === "string"
          ? value
          : value && typeof value === "object" && "name" in value
            ? (value as { name: string }).name
            : undefined;

      return typeof groupField === "string" && groupNames.includes(groupField);
    });

    return hasMatchingGrouping ? [grouping] : [];
  }, [loading, groups, grouping, machines]);

  const columns = useMachinesTableColumns(grouping);

  return (
    <>
      {errors && !headerFormOpen ? (
        <ErrorsNotification
          errors={errors}
          onAfterDismiss={() => dispatch(machineActions.cleanup())}
        />
      ) : null}
      {!headerFormOpen ? <ErrorsNotification errors={machinesErrors} /> : null}
      <VaultNotification />
      <GenericTable
        className={classNames("machines-table", {
          "has-hidden-columns": hiddenColumns.length,
        })}
        columns={columns}
        data={machines}
        filterCells={(row, column) =>
          !hiddenColumns.includes(column.id) && filterCells(row, column)
        }
        filterHeaders={(header) =>
          !hiddenColumns.includes(header.column.id) && filterHeaders(header)
        }
        groupBy={activeGroupBy}
        isLoading={loading}
        key={callId}
        noData={
          searchFilter
            ? "No machines match the search criteria."
            : "No machines found."
        }
        pagination={{
          currentPage: page,
          dataContext: "machines",
          handlePageSizeChange: handlePageSizeChange,
          isPending: false,
          itemsPerPage: size,
          setCurrentPage: setPage,
          totalItems: machineCount ?? 0,
        }}
        pinGroup={groups.map((g) => ({ value: g.name ?? "", isTop: true }))}
        selection={{
          rowSelection,
          setRowSelection,
        }}
        setSorting={setSorting}
        showChevron
        variant="full-height"
      />
    </>
  );
};

export default MachinesTable;
