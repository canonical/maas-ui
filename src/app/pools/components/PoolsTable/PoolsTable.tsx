import type { ReactElement } from "react";

import usePoolsTableColumns from "./usePoolsTableColumns/usePoolsTableColumns";

import { usePools } from "@/app/api/query/pools";
import GenericTable from "@/app/base/components/GenericTable";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import { useSidePanel } from "@/app/base/side-panel-context";
import { PoolActionSidePanelViews } from "@/app/pools/constants";

const PoolsTable = (): ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const pools = usePools({
    query: { page: debouncedPage, size },
  });

  const columns = usePoolsTableColumns({
    onEdit: (row) => {
      setSidePanelContent({
        view: PoolActionSidePanelViews.EDIT_POOL,
        extras: {
          poolId: row.original.id,
        },
      });
    },
    onDelete: (row) => {
      setSidePanelContent({
        view: PoolActionSidePanelViews.DELETE_POOL,
        extras: {
          poolId: row.original.id,
        },
      });
    },
  });

  return (
    <GenericTable
      columns={columns}
      data={pools.data?.items ?? []}
      isLoading={pools.isPending}
      noData="No pools found."
      pagination={{
        currentPage: page,
        dataContext: "pools",
        handlePageSizeChange: handlePageSizeChange,
        isPending: pools.isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: pools.data?.total ?? 0,
      }}
      sortBy={[{ id: "machine_ready_count", desc: true }]}
      variant="full-height"
    />
  );
};

export default PoolsTable;
