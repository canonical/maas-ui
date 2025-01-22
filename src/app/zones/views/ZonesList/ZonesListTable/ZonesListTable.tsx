import React from "react";

import { useZones } from "@/app/api/query/zones";
import GenericTable from "@/app/base/components/GenericTable";
import useZonesTableColumns from "@/app/zones/views/ZonesList/useZonesTableColumns";

import "./_index.scss";

export enum TestIds {
  ZonesTable = "zones-table",
}

const ZonesListTable: React.FC = () => {
  const zones = useZones();

  const columns = useZonesTableColumns();

  return <GenericTable columns={columns} data={zones.data!} />;
};

export default ZonesListTable;
