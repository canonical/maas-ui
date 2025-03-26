import type { Dispatch, SetStateAction } from "react";

import type { RowSelectionState } from "@tanstack/react-table";

import type { Pool } from "../../types";

import usePoolsTableColumns from "./usePoolsTableColumns/usePoolsTableColumns";

import { usePools } from "@/app/api/query/pools";
import type { ResourcePoolWithSummaryResponse } from "@/app/apiclient";
import GenericTable from "@/app/base/components/GenericTable";

type SMPoolsTableProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
};

const getPools = (resources: ResourcePoolWithSummaryResponse[]): Pool[] => {
  return resources.map((resource) => {
    return {
      id: resource.id,
      name: resource.name,
      machines: resource,
      description: resource.description,
      resource: resource,
    };
  });
};

const PoolsTable = ({ selectedRows, setSelectedRows }: SMPoolsTableProps) => {
  const listPools = usePools();
  const resourcePools = listPools.data?.items || [];
  const pools = getPools(resourcePools);
  return (
    <GenericTable
      canSelect
      columns={usePoolsTableColumns()}
      data={pools}
      noData="No pools found."
      rowSelection={selectedRows}
      setRowSelection={setSelectedRows}
      variant="full-height"
    />
  );
};

export default PoolsTable;
