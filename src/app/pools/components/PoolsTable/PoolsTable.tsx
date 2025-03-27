import usePoolsTableColumns from "./usePoolsTableColumns/usePoolsTableColumns";

import { usePools } from "@/app/api/query/pools";
import GenericTable from "@/app/base/components/GenericTable";

const PoolsTable = () => {
  const listPools = usePools();
  const resourcePools = listPools.data?.items || [];
  return (
    <GenericTable
      columns={usePoolsTableColumns()}
      data={resourcePools}
      noData="No pools found."
      variant="full-height"
    />
  );
};

export default PoolsTable;
