import type {
  TableCellProps,
  TableHeaderProps,
} from "@canonical/react-components";
import {
  TableCell as TableCellComponent,
  TableHeader as TableHeaderComponent,
} from "@canonical/react-components";

import type { SubnetsTableColumn } from "./types";

export const TableHeader = ({
  label,
  ...props
}: TableHeaderProps & {
  label: string;
}): JSX.Element => (
  <TableHeaderComponent {...props}>{label}</TableHeaderComponent>
);

export const TableCell = ({
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
