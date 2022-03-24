import { useMemo } from "react";

import { Pagination, ModularTable } from "@canonical/react-components";

import {
  CellContents,
  SpaceCellContents,
} from "app/subnets/views/SubnetsList/SubnetsTable/components";
import {
  subnetColumnLabels,
  SubnetsColumns,
} from "app/subnets/views/SubnetsList/SubnetsTable/constants";
import { usePagination } from "app/subnets/views/SubnetsList/SubnetsTable/hooks";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";
import { groupRowsBySpace } from "app/subnets/views/SubnetsList/SubnetsTable/utils";

const SpaceTable = ({
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
        emptyMsg={emptyMsg}
        className="subnets-table"
        aria-label="Subnets by Space"
        getCellProps={({ value, column }) => ({
          className: `subnets-table__cell--${column.id}${
            value.isVisuallyHidden ? " u-no-border--top" : ""
          }`,
          role: column.id === "space" ? "rowheader" : undefined,
        })}
        getHeaderProps={(header) => ({
          className: `subnets-table__cell--${header.id}`,
        })}
        getRowProps={(row) => ({
          "aria-label": row.values.space.label,
        })}
        columns={useMemo(
          () => [
            {
              Header: subnetColumnLabels[SubnetsColumns.SPACE],
              accessor: SubnetsColumns.SPACE,
              Cell: SpaceCellContents,
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
              Header: subnetColumnLabels[SubnetsColumns.FABRIC],
              accessor: SubnetsColumns.FABRIC,
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
              className: "u-align--right",
              Cell: CellContents,
            },
          ],
          []
        )}
        data={groupRowsBySpace(pageData)}
      />
      <Pagination {...paginationProps} aria-label="pagination" />
    </>
  );
};

export default SpaceTable;
