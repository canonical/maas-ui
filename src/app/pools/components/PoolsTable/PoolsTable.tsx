import usePoolsTableColumns from "./usePoolsTableColumns/usePoolsTableColumns";

import { usePools } from "@/app/api/query/pools";
import GenericTable from "@/app/base/components/GenericTable";
import usePagination from "@/app/base/hooks/usePagination/usePagination";

const PoolsTable = () => {
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const pools = usePools({
    query: { page: debouncedPage, size },
  });

  return (
    <GenericTable
      columns={usePoolsTableColumns()}
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
