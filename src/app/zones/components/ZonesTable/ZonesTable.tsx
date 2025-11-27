import React, { useMemo } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import { useBaseZones, useZones } from "@/app/api/query/zones";
import usePagination from "@/app/base/hooks/usePagination/usePagination";
import type { ZoneRow } from "@/app/zones/components/ZonesTable/useZonesTableColumns/useZonesTableColumns";
import useZonesTableColumns from "@/app/zones/components/ZonesTable/useZonesTableColumns/useZonesTableColumns";

import "./_index.scss";

const ZonesTable: React.FC = () => {
  const { page, debouncedPage, size, handlePageSizeChange, setPage } =
    usePagination();

  const baseZones = useBaseZones({
    query: { page: debouncedPage, size },
  });

  const zonesWithSummary = useZones(
    {
      query: { page: debouncedPage, size },
    },
    baseZones.isSuccess
  );

  const columns = useZonesTableColumns({
    isSummaryPending: zonesWithSummary.isPending,
  });

  const data = useMemo((): ZoneRow[] => {
    if (!baseZones.data) {
      return [];
    }

    if (!zonesWithSummary.data) {
      return baseZones.data.items.map((item) => ({
        ...item,
        devices_count: undefined,
        machines_count: undefined,
        controllers_count: undefined,
      }));
    }

    return baseZones.data.items.map((item) => ({
      ...item,
      devices_count: zonesWithSummary.data.items.find(
        (zone) => zone.id === item.id
      )?.devices_count,
      controllers_count: zonesWithSummary.data.items.find(
        (zone) => zone.id === item.id
      )?.controllers_count,
      machines_count: zonesWithSummary.data.items.find(
        (zone) => zone.id === item.id
      )?.machines_count,
    }));
  }, [baseZones.data, zonesWithSummary.data]);

  return (
    <GenericTable
      columns={columns}
      data={data}
      isLoading={baseZones.isPending}
      noData="No zones found."
      pagination={{
        currentPage: page,
        dataContext: "zones",
        handlePageSizeChange: handlePageSizeChange,
        isPending: baseZones.isPending,
        itemsPerPage: size,
        setCurrentPage: setPage,
        totalItems: zonesWithSummary.data?.total ?? 0,
      }}
      sorting={[{ id: "machines_count", desc: true }]}
    />
  );
};

export default ZonesTable;
