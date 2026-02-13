import type { ReactElement } from "react";

import { GenericTable } from "@canonical/maas-react-components";

import useDatastoreTableColumns from "./useDatastoreTableColumns/useDatastoreTableColumns";

import type { Disk, Partition } from "@/app/store/types/node";

import "./_index.scss";

type DatastoreTableProps = {
  data: (Disk | Partition)[];
  maxSpares?: number;
  spareBlockDeviceIds?: number[];
  sparePartitionIds?: number[];
  handleSpareCheckbox?: (
    storageDevice: Disk | Partition,
    isSpareDevice: boolean
  ) => void;
};

const DatastoreTable = ({
  data,
  maxSpares = 0,
  spareBlockDeviceIds,
  sparePartitionIds,
  handleSpareCheckbox,
}: DatastoreTableProps): ReactElement => {
  const columns = useDatastoreTableColumns({
    maxSpares,
    spareBlockDeviceIds,
    sparePartitionIds,
    handleSpareCheckbox,
  });

  return (
    <GenericTable
      aria-label="Datastore table"
      className="datastore-table"
      columns={columns}
      data={data}
      isLoading={false}
    />
  );
};

export default DatastoreTable;
