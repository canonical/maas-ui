import { memo } from "react";

import { Table, TableRow } from "@canonical/react-components";

import { getRowPropsAreEqual } from "../utils";

import {
  TableHeader,
  TableCell,
} from "app/subnets/views/SubnetsList/SubnetsTable/components";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";

export const FabricRow = memo(
  ({ columns }: SubnetsTableRow): JSX.Element => (
    <TableRow aria-label={columns.fabric.label || undefined}>
      <TableCell
        role="rowheader"
        className="subnets-table__cell--fabric"
        aria-label="Fabric"
        cellData={columns.fabric}
      >
        {columns.fabric.label}
      </TableCell>
      <TableCell
        role="column"
        className="subnets-table__cell--vlan"
        aria-label="VLAN"
        cellData={columns.vlan}
      >
        {columns.vlan.label}
      </TableCell>
      <TableCell
        role="column"
        className="subnets-table__cell--dhcp"
        aria-label="DHCP"
        cellData={columns.dhcp}
      >
        {columns.dhcp.label}
      </TableCell>
      <TableCell
        role="column"
        className="subnets-table__cell--subnet"
        aria-label="Subnet"
        cellData={columns.subnet}
      >
        {columns.subnet.label}
      </TableCell>
      <TableCell
        role="column"
        className="subnets-table__cell--ips"
        aria-label="IPs"
        cellData={columns.ips}
      >
        {columns.ips.label}
      </TableCell>
      <TableCell
        role="column"
        className="subnets-table__cell--space u-align--right"
        aria-label="Space"
        cellData={columns.space}
      >
        {columns.space.label}
      </TableCell>
    </TableRow>
  ),
  getRowPropsAreEqual
);

const FabricTable = ({ rows }: { rows: SubnetsTableRow[] }): JSX.Element => {
  return (
    <Table role="table" className="subnets-table" aria-label="Subnets">
      <thead>
        <tr>
          <TableHeader label="Fabric" className="subnets-table__cell--fabric" />
          <TableHeader label="VLAN" className="subnets-table__cell--vlan" />
          <TableHeader label="DHCP" className="subnets-table__cell--dhcp" />
          <TableHeader label="Subnet" className="subnets-table__cell--subnet" />
          <TableHeader
            label="Available IPs"
            className="subnets-table__cell--ips"
          />
          <TableHeader
            label="Space"
            className="subnets-table__cell--space u-align--right"
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          return (
            <FabricRow
              key={`${row.sortData?.fabricId}-${row.sortData?.vlanId}-${i}`}
              {...row}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

export default FabricTable;
