import { useMemo } from "react";

import { Pagination, MainTable } from "@canonical/react-components";

import TableHeader from "app/base/components/TableHeader";
import { generateSubnetGroupRows } from "app/subnets/views/SubnetsList/SubnetsTable/components";
import {
  spaceTableColumns,
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
  const headers = useMemo(
    () => [
      {
        "aria-label": subnetColumnLabels[SubnetsColumns.VLAN],
        key: SubnetsColumns.VLAN,
        content: (
          <TableHeader>{subnetColumnLabels[SubnetsColumns.VLAN]}</TableHeader>
        ),
      },
      {
        "aria-label": subnetColumnLabels[SubnetsColumns.DHCP],
        key: SubnetsColumns.DHCP,
        content: (
          <TableHeader>{subnetColumnLabels[SubnetsColumns.DHCP]}</TableHeader>
        ),
      },
      {
        "aria-label": subnetColumnLabels[SubnetsColumns.FABRIC],
        key: SubnetsColumns.FABRIC,
        content: (
          <TableHeader>{subnetColumnLabels[SubnetsColumns.FABRIC]}</TableHeader>
        ),
      },
      {
        "aria-label": subnetColumnLabels[SubnetsColumns.SUBNET],
        key: SubnetsColumns.SUBNET,
        content: (
          <TableHeader>{subnetColumnLabels[SubnetsColumns.SUBNET]}</TableHeader>
        ),
      },
      {
        "aria-label": subnetColumnLabels[SubnetsColumns.IPS],
        key: SubnetsColumns.IPS,
        className: "u-align--right",
        content: (
          <TableHeader>{subnetColumnLabels[SubnetsColumns.IPS]}</TableHeader>
        ),
      },
    ],
    []
  );

  const rowData = useMemo(() => groupRowsBySpace(pageData), [pageData]);

  const rows = generateSubnetGroupRows({
    groups: rowData,
    itemName: "network",
    columnLength: spaceTableColumns.length,
    groupCount: data.length,
  });

  return (
    <>
      <MainTable
        aria-label="Subnets by Space"
        emptyStateMsg={emptyMsg}
        headers={headers}
        rows={rows}
      />
      <Pagination {...paginationProps} aria-label="pagination" />
    </>
  );
};

export default SpaceTable;
