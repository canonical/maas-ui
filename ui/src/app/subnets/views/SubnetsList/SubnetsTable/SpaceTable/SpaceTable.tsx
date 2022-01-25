import { memo, useState } from "react";

import { Table, TableRow, Button } from "@canonical/react-components";

import { getRowPropsAreEqual } from "../utils";

import {
  TableHeader,
  TableCell,
} from "app/subnets/views/SubnetsList/SubnetsTable/components";
import type { SubnetsTableRow } from "app/subnets/views/SubnetsList/SubnetsTable/types";

export const SpaceRow = memo(({ columns }: SubnetsTableRow): JSX.Element => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  return (
    <TableRow aria-label={columns.space.label || undefined}>
      <TableCell
        role="column"
        className="subnets-table__cell--space"
        aria-label="Space"
        cellData={columns.space}
      >
        {columns.space.label === "No space" ? (
          <Button
            appearance="base"
            dense
            hasIcon
            aria-label="No space - press to see more information"
            onClick={() => setIsWarningOpen(!isWarningOpen)}
          >
            <i className="p-icon--warning"></i> <span>No space</span>
          </Button>
        ) : (
          columns.space.label
        )}
        {isWarningOpen ? (
          <div>
            MAAS integrations require a space in order to determine the purpose
            of a network. Define a space for each subnet by selecting the space
            on the VLAN details page.
          </div>
        ) : null}
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
        role="rowheader"
        className="subnets-table__cell--fabric"
        aria-label="Fabric"
        cellData={columns.fabric}
      >
        {columns.fabric.label}
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
        className="subnets-table__cell--ips u-align--right"
        aria-label="IPs"
        cellData={columns.ips}
      >
        {columns.ips.label}
      </TableCell>
    </TableRow>
  );
}, getRowPropsAreEqual);

const SpaceTable = ({ rows }: { rows: SubnetsTableRow[] }): JSX.Element => {
  return (
    <Table role="table" className="subnets-table" aria-label="Subnets">
      <thead>
        <tr>
          <TableHeader label="Space" className="subnets-table__cell--space" />
          <TableHeader label="VLAN" className="subnets-table__cell--vlan" />
          <TableHeader label="DHCP" className="subnets-table__cell--dhcp" />
          <TableHeader label="Fabric" className="subnets-table__cell--fabric" />
          <TableHeader label="Subnet" className="subnets-table__cell--subnet" />
          <TableHeader
            label="Available IPs"
            className="subnets-table__cell--ips u-align--right"
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <SpaceRow
            key={`${row.sortData?.spaceName}-${row.sortData?.vlanId}-${i}`}
            {...row}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default SpaceTable;
