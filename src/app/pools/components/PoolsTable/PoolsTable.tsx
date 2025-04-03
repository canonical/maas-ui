import { useState } from "react";

import usePoolsTableColumns from "./usePoolsTableColumns/usePoolsTableColumns";

import { usePoolCount, usePools } from "@/app/api/query/pools";
import GenericTable from "@/app/base/components/GenericTable";

const PoolsTable = () => {
  const { data: poolCount } = usePoolCount();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 50,
    total: poolCount ?? 0,
  });

  const listPools = usePools({ query: pagination });
  const resourcePools = listPools.data?.items || [];

  return (
    <GenericTable
      columns={usePoolsTableColumns()}
      data={resourcePools}
      noData="No pools found."
      pagination={pagination}
      setPagination={setPagination}
      variant="full-height"
    />
  );
};

export default PoolsTable;
