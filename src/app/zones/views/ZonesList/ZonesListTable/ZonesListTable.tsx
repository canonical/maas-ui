import { useState } from "react";

import type { RowSelectionState } from "@tanstack/react-table";

import { useZones } from "@/app/api/query/zones";
import GenericTable from "@/app/base/components/GenericTable";
import useZonesTableColumns from "@/app/zones/views/ZonesList/useZonesTableColumns";

import "./_index.scss";

export enum TestIds {
  ZonesTable = "zones-table",
}

const ZonesListTable = (): JSX.Element => {
  const zones = useZones();

  const columns = useZonesTableColumns();
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

  return (
    <GenericTable
      columns={columns}
      data={zones.data ?? []}
      getRowId={(row) => `${row.id}`}
      rowSelection={selectedRows}
      setRowSelection={setSelectedRows}
    />
  );
};

export default ZonesListTable;
