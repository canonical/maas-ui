import type { ReactElement } from "react";
import { useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";

import VaultNotification from "@/app/base/components/VaultNotification";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import type { Sort } from "@/app/base/types";
import useMachinesTableColumns, {
  filterCells,
  filterHeaders,
} from "@/app/machines/components/MachinesTable/useMachinesTableColumns/useMachinesTableColumns";
import ErrorsNotification from "@/app/machines/views/MachineList/ErrorsNotification";
import { DEFAULTS } from "@/app/machines/views/MachineList/MachineListTable/constants";
import type { useResponsiveColumns } from "@/app/machines/views/MachineList/hooks";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { FetchFilters } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachines } from "@/app/store/machine/utils/hooks";

import "./index.scss";

type MachinesTableProps = {
  grouping: FetchGroupKey;
  hiddenColumns: ReturnType<typeof useResponsiveColumns>[0];
  hiddenGroups: (string | null)[];
  headerFormOpen?: boolean;
  searchFilter: FetchFilters;
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
    { id: "hostname", desc: false },
  ]);
  const sort: Sort<FetchGroupKey> = {
    key: sorting.length ? SortKeyMapping[sorting[0].id] : null,
    direction: sorting.length
      ? sorting[0].desc
        ? "descending"
        : "ascending"
      : "none",
  };

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { groups, loading, machineCount, machines, machinesErrors } =
    useFetchMachines({
      collapsedGroups: hiddenGroups,
      filters: searchFilter,
      grouping,
      sortDirection: sort.direction,
      sortKey: sort.key,
      pagination: {
        currentPage: page,
        setCurrentPage: setPage,
        pageSize: size,
      },
    });

  const columns = useMachinesTableColumns(
    grouping ?? DEFAULTS.grouping,
    groups![0],
    searchFilter
  );

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
        groupBy={[grouping ?? "status"]}
        isLoading={loading}
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
        sorting={sorting}
        variant="full-height"
      />
    </>
  );
};

export default MachinesTable;
