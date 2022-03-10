import { useMemo } from "react";

import ModularTable from "app/base/components/ModularTable";
import {
  CellContents,
  SpaceCellContents,
} from "app/subnets/views/SubnetsList/SubnetsTable/components";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const SpaceTable = ({ data }: { data: SubnetsTableRow[] }): JSX.Element => {
  return (
    <ModularTable<SubnetsTableRow>
      emptyMsg="Loading..."
      getTableProps={(tableProps) => ({
        ...tableProps,
        className: "subnets-table",
        "aria-label": "Subnets",
      })}
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
            Header: "Space",
            accessor: "space",
            Cell: SpaceCellContents,
          },
          {
            Header: "VLAN",
            accessor: "vlan",
            Cell: CellContents,
          },
          {
            Header: "DHCP",
            accessor: "dhcp",
            Cell: CellContents,
          },
          {
            Header: "Fabric",
            accessor: "fabric",
            Cell: CellContents,
          },
          {
            Header: "Subnet",
            accessor: "subnet",
            Cell: CellContents,
          },
          {
            Header: "Available IPs",
            accessor: "ips",
            Cell: CellContents,
          },
        ],
        []
      )}
      data={useMemo(() => data, [data])}
    />
  );
};

export default SpaceTable;
