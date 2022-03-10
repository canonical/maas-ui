import type { ReactNode } from "react";

import Icon from "@canonical/react-components/dist/components/Icon";
import Table from "@canonical/react-components/dist/components/Table";
import TableCell from "@canonical/react-components/dist/components/TableCell";
import TableHeader from "@canonical/react-components/dist/components/TableHeader";
import TableRow from "@canonical/react-components/dist/components/TableRow";
import { useTable } from "react-table";
import type {
  Column,
  TablePropGetter,
  Cell,
  UseTableOptions,
  Row,
} from "react-table";

export type Props<D extends Record<string, unknown>> = {
  /**
   * The columns of the table.
   */
  columns: Column<D>[];
  /**
   * The data of the table.
   */
  data: D[];
  /**
   * A message to display if data is empty.
   */
  emptyMsg?: string;
  /**
   * Optional extra row to display underneath the main table content.
   */
  footer?: ReactNode;
  getTableProps?: TablePropGetter<D>;
  getHeaderProps?: (column: Column<D>) => Record<string, unknown>;
  getColumnProps?: (column: Column<D>) => Record<string, unknown>;
  getRowProps?: (row: Row<D>) => Record<string, unknown>;
  getCellProps?: (cell: Cell<D>) => Record<string, unknown>;
  getRowId?: UseTableOptions<D>["getRowId"];
};

const defaultPropGetter = () => ({});

// TODO: Replace this component with a @canonical/react-components ModularTable
// after upgrading to the lastest version that includes additional options for the MainTable
// https://github.com/canonical-web-and-design/react-components/pull/723
function ModularTable<D extends Record<string, unknown>>({
  data,
  columns,
  emptyMsg,
  footer,
  getTableProps = defaultPropGetter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
  getRowId,
}: Props<D>): JSX.Element {
  const {
    getTableProps: getBaseTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<D>({ columns, data, getRowId: getRowId || undefined });

  const showEmpty: boolean = !!emptyMsg && (!rows || rows.length === 0);

  return (
    <Table {...getBaseTableProps(getTableProps)}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeader
                {...column.getHeaderProps([
                  {
                    className: column.className,
                  },
                  {
                    className: column.getCellIcon
                      ? "p-table__cell--icon-placeholder"
                      : "",
                  },
                  getColumnProps(column),
                  getHeaderProps(column),
                ])}
              >
                {column.render("Header")}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          // This function is responsible for lazily preparing a row for rendering.
          // Any row that you intend to render in your table needs to be passed to this function before every render.
          // see: https://react-table.tanstack.com/docs/api/useTable#instance-properties
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps(getRowProps(row))}>
              {row.cells.map((cell) => {
                const hasColumnIcon = cell.column.getCellIcon;
                const iconName =
                  hasColumnIcon && cell.column.getCellIcon?.(cell);

                return (
                  <TableCell
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                      },
                      {
                        className: hasColumnIcon
                          ? "p-table__cell--icon-placeholder"
                          : "",
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    {iconName && <Icon name={iconName} />}
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
        {showEmpty && (
          <TableRow>
            <TableCell colSpan={columns.length}>{emptyMsg}</TableCell>
          </TableRow>
        )}
        {footer && (
          <TableRow>
            <TableCell colSpan={columns.length}>{footer}</TableCell>
          </TableRow>
        )}
      </tbody>
    </Table>
  );
}

export default ModularTable;
