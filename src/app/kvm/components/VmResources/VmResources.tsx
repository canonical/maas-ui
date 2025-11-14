import type { ReactElement } from "react";
import { useState } from "react";

import { GenericTable } from "@canonical/maas-react-components";
import { ContextualMenu } from "@canonical/react-components";
import type { SortingState } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import usePagination from "@/app/base/hooks/usePagination/usePagination";
import type { Sort } from "@/app/base/types";
import { SortKeyMapping } from "@/app/machines/components/MachinesTable/MachinesTable";
import useMachinesTableColumns from "@/app/machines/components/MachinesTable/useMachinesTableColumns/useMachinesTableColumns";
import type { FetchFilters } from "@/app/store/machine/types";
import { FetchGroupKey, FilterGroupKey } from "@/app/store/machine/types";
import { useFetchedCount } from "@/app/store/machine/utils";
import { useFetchMachines } from "@/app/store/machine/utils/hooks";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import type { RootState } from "@/app/store/root/types";

import "./_index.scss";

export enum Label {
  ResourceVMs = "Resource VMs",
}

export type VmResourcesProps = {
  filters?: FetchFilters;
  podId: Pod["id"];
};

export const VMS_PER_PAGE = 5;

const VmResources = ({ filters, podId }: VmResourcesProps): ReactElement => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, podId)
  );
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

  const { page, size, handlePageSizeChange, setPage } =
    usePagination(VMS_PER_PAGE);

  const {
    loading,
    machineCount,
    machines: vms,
    groups,
  } = useFetchMachines({
    filters: {
      ...filters,
      [FilterGroupKey.Pod]: pod ? [pod.name] : [],
    },
    sortDirection: sort.direction,
    sortKey: sort.key,
    pagination: {
      currentPage: page,
      setCurrentPage: setPage,
      pageSize: VMS_PER_PAGE,
    },
  });

  const count = useFetchedCount(machineCount, loading);
  const columns = useMachinesTableColumns(FetchGroupKey.None, groups![0], {
    ...filters,
    [FilterGroupKey.Pod]: pod ? [pod.name] : [],
  });

  return (
    <div className="vm-resources">
      <div className="vm-resources__dropdown-container">
        <ContextualMenu
          dropdownClassName="vm-resources__dropdown"
          position="left"
          toggleAppearance="link"
          toggleClassName="vm-resources__toggle is-dense"
          toggleDisabled={!count}
          toggleLabel={`Total VMs: ${count ?? 0}`}
          toggleProps={{ position: "left", "aria-label": Label.ResourceVMs }}
        >
          <GenericTable
            columns={columns.filter(
              (column) =>
                column.id &&
                ![
                  "group",
                  "owner",
                  "pool",
                  "zone",
                  "fabric",
                  "disks",
                  "storage",
                ].includes(column.id)
            )}
            data={vms}
            isLoading={loading}
            pagination={{
              currentPage: page,
              dataContext: "machines",
              handlePageSizeChange: handlePageSizeChange,
              isPending: false,
              itemsPerPage: size,
              setCurrentPage: setPage,
              totalItems: machineCount ?? 0,
              pageSizes: [VMS_PER_PAGE],
            }}
            setSorting={setSorting}
            sorting={sorting}
          />
        </ContextualMenu>
      </div>
    </div>
  );
};

export default VmResources;
