import { useMemo } from "react";

import { Pagination, ModularTable } from "@canonical/react-components";

import { CellContents } from "app/subnets/views/SubnetsList/SubnetsTable/components";
import {
  subnetColumnLabels,
  SubnetsColumns,
} from "app/subnets/views/SubnetsList/SubnetsTable/constants";
import { usePagination } from "app/subnets/views/SubnetsList/SubnetsTable/hooks";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";
import { groupRowsByFabricAndVlan } from "app/subnets/views/SubnetsList/SubnetsTable/utils";

const FabricTable = ({
  data,
  emptyMsg,
}: {
  data: SubnetsTableRow[];
  emptyMsg: string;
}): JSX.Element => {
  const { pageData, ...paginationProps } = usePagination(data);

  return (
    <>
      <ModularTable
        aria-label="Subnets by Fabric"
        className="subnets-table"
        columns={useMemo(
          () => [
            {
              Header: subnetColumnLabels[SubnetsColumns.FABRIC],
              accessor: SubnetsColumns.FABRIC,
              Cell: CellContents,
            },
            {
              Header: subnetColumnLabels[SubnetsColumns.VLAN],
              accessor: SubnetsColumns.VLAN,
              Cell: CellContents,
            },
            {
              Header: subnetColumnLabels[SubnetsColumns.DHCP],
              accessor: SubnetsColumns.DHCP,
              Cell: CellContents,
            },
            {
              Header: subnetColumnLabels[SubnetsColumns.SUBNET],
              accessor: SubnetsColumns.SUBNET,
              Cell: CellContents,
            },
            {
              Header: subnetColumnLabels[SubnetsColumns.IPS],
              accessor: SubnetsColumns.IPS,
              Cell: CellContents,
            },
            {
              Header: subnetColumnLabels[SubnetsColumns.SPACE],
              accessor: SubnetsColumns.SPACE,
              className: "u-align--right",
              Cell: CellContents,
            },
          ],
          []
        )}
        data={groupRowsByFabricAndVlan(pageData)}
        emptyMsg={emptyMsg}
        getCellProps={({ value, column }) => ({
          className: `subnets-table__cell--${column.id}${
            value.isVisuallyHidden ? " u-no-border--top" : ""
          }`,
          role: column.id === "fabric" ? "rowheader" : undefined,
        })}
        getHeaderProps={(header) => ({
          className: `subnets-table__cell--${header.id}`,
        })}
        getRowProps={(row) => ({
          "aria-label": row.values.fabric.label,
        })}
      />
      <Pagination {...paginationProps} aria-label="pagination" />
    </>
  );
};

export default FabricTable;
