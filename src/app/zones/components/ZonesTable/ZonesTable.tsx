import React from "react";

import { GenericTable, TableCaption } from "@canonical/maas-react-components";

import { useZones } from "@/app/api/query/zones";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import useZonesTableColumns from "@/app/zones/components/ZonesTable/useZonesTableColumns/useZonesTableColumns";

import "./_index.scss";

const ZonesTable: React.FC = () => {
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();
  const zones = useZones({
    query: { page: debouncedPage, size },
  });

  const columns = useZonesTableColumns();

  return (
    <GenericTable
      columns={columns}
      data={zones.data?.items ?? []}
      isLoading={zones.isPending}
      noData={<TableCaption>No zones available.</TableCaption>}
      pagination={{
        currentPage: page,
        dataContext: "zones",
        handlePageSizeChange: handlePageSizeChange,
        isPending: zones.isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: zones.data?.total ?? 0,
      }}
      sortBy={[{ id: "machines_count", desc: true }]}
    />
  );
};

export default ZonesTable;
