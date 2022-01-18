import { memo, useState } from "react";

import {
  TableRow as TableRowComponent,
  TableHeader as TableHeaderComponent,
  TableCell as TableCellComponent,
  Button,
} from "@canonical/react-components";
import type {
  TableHeaderProps,
  TableCellProps,
} from "@canonical/react-components";

import type { SubnetsTableRow, SubnetsTableColumn } from "./types";
import { getRowPropsAreEqual } from "./utils";

export const TableHeader = ({
  label,
  ...props
}: TableHeaderProps & {
  label: string;
}): JSX.Element => (
  <TableHeaderComponent {...props}>{label}</TableHeaderComponent>
);

const TableCell = ({
  cellData,
  children,
  className,
  ...props
}: TableCellProps & {
  cellData: SubnetsTableColumn;
}): JSX.Element => (
  <TableCellComponent
    className={`${className} ${
      cellData.isVisuallyHidden ? "u-no-border--top" : ""
    }`}
    {...props}
  >
    <span
      className={
        cellData.isVisuallyHidden ? "subnets-table__visually-hidden" : ""
      }
    >
      {cellData.href ? <a href={cellData.href}>{children}</a> : children}
    </span>
  </TableCellComponent>
);

export const FabricRow = memo(
  ({ columns }: SubnetsTableRow): JSX.Element => (
    <TableRowComponent
      aria-label={columns.fabric.label || undefined}
      style={{
        transition: "opacity 250ms",
        opacity: 1,
      }}
    >
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
    </TableRowComponent>
  ),
  getRowPropsAreEqual
);

export const SpaceRow = memo(({ columns }: SubnetsTableRow): JSX.Element => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  return (
    <TableRowComponent
      aria-label={columns.fabric.label || undefined}
      style={{
        transition: "opacity 250ms",
        opacity: 1,
      }}
    >
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
    </TableRowComponent>
  );
}, getRowPropsAreEqual);
