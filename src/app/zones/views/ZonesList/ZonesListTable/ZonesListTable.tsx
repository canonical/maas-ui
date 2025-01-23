import React from "react";

import { TableCaption } from "@canonical/maas-react-components";

import { useZones } from "@/app/api/query/zones";
import GenericTable from "@/app/base/components/GenericTable";
import useZonesTableColumns from "@/app/zones/views/ZonesList/ZonesListTable/useZonesTableColumns/useZonesTableColumns";

import "./_index.scss";

const ZonesListTable: React.FC = () => {
  const zones = useZones();

  const columns = useZonesTableColumns();

  return (
    <GenericTable
      columns={columns}
      data={zones.data!}
      noData={<TableCaption>No zones available.</TableCaption>}
    />
  );
};

export default ZonesListTable;
