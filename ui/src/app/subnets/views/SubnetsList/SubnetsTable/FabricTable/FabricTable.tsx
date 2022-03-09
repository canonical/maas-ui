import { useMemo } from "react";

import { CellContents } from "../components";

import ModularTable from "app/base/components/ModularTable";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";

const FabricTable = ({ data }: { data: SubnetsTableRow[] }): JSX.Element => {
  return (
    <ModularTable<SubnetsTableRow>
      emptyMsg="Loading..."
      getTableProps={(tableProps) => ({
        ...tableProps,
        className: "subnets-table",
      })}
      getCellProps={({ value, column }) => ({
        className: `subnets-table__cell--${column.id}${
          value.isVisuallyHidden ? " u-no-border--top" : ""
        }`,
      })}
      getHeaderProps={(header) => ({
        className: `subnets-table__cell--${header.id}`,
      })}
      columns={useMemo(
        () => [
          {
            Header: "Fabric",
            accessor: "fabric",
            Cell: CellContents,
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
            Header: "Subnet",
            accessor: "subnet",
            Cell: CellContents,
          },
          {
            Header: "Available IPs",
            accessor: "ips",
            Cell: CellContents,
          },
          {
            Header: "Space",
            accessor: "space",
            className: "u-align--right",
            Cell: CellContents,
          },
        ],
        []
      )}
      data={useMemo(() => data, [data])}
    />
  );
};

export default FabricTable;
