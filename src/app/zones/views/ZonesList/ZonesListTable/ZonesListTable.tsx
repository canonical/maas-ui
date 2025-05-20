import React from "react";

import { TableCaption } from "@canonical/maas-react-components";
import { useSelector } from "react-redux";

import { useZones } from "@/app/api/query/zones";
import GenericTable from "@/app/base/components/GenericTable";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import authSelectors from "@/app/store/auth/selectors";
import useZonesTableColumns from "@/app/zones/views/ZonesList/ZonesListTable/useZonesTableColumns/useZonesTableColumns";

import "./_index.scss";

const ZonesListTable: React.FC = () => {
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();
  const zones = useZones({
    query: { page: debouncedPage, size },
  });

  const isAdmin = useSelector(authSelectors.isAdmin);
  const columns = useZonesTableColumns({
    isAdmin,
  });

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

export default ZonesListTable;
