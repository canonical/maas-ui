import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";

import { DynamicTable } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import type {
  Column,
  ColumnDef,
  ColumnSort,
  ExpandedState,
  GroupingState,
  Header,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import classNames from "classnames";

import "./_index.scss";
import SortingIndicator from "./SortingIndicator";

type GenericTableProps<T> = {
  ariaLabel?: string;
  columns: ColumnDef<T, Partial<T>>[];
  data: T[];
  filterCells: (row: Row<T>, column: Column<T>) => boolean;
  filterHeaders: (header: Header<T, unknown>) => boolean;
  getRowId: (
    originalRow: T,
    index: number,
    parent?: Row<T> | undefined
  ) => string;
  groupBy?: string[];
  sortBy?: ColumnSort[];
  rowSelection: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

const GenericTable = <T,>({
  ariaLabel,
  columns,
  data,
  filterCells,
  filterHeaders,
  getRowId,
  groupBy,
  sortBy,
  rowSelection,
  setRowSelection,
}: GenericTableProps<T>) => {
  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [sorting, setSorting] = useState<SortingState>(sortBy ?? []);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      for (const { id, desc } of sorting) {
        const aValue = a[id as keyof typeof a];
        const bValue = b[id as keyof typeof b];
        if (aValue < bValue) {
          return desc ? 1 : -1;
        }
        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
      }
      return 0;
    });
  }, [data, sorting]);

  const table = useReactTable<T>({
    data: sortedData,
    columns,
    state: {
      grouping,
      expanded,
      sorting,
      rowSelection,
    },
    manualPagination: true,
    autoResetExpanded: false,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    enableSorting: true,
    enableExpanding: true,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    groupedColumnMode: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId,
  });

  return (
    <DynamicTable
      aria-label={ariaLabel}
      className="p-table-dynamic--with-select generic-table"
      variant={"full-height"}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.filter(filterHeaders).map((header) => (
              <th className={classNames(`${header.column.id}`)} key={header.id}>
                {header.column.getCanSort() ? (
                  <Button
                    appearance="link"
                    className="p-button--table-header"
                    onClick={header.column.getToggleSortingHandler()}
                    type="button"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <SortingIndicator header={header} />
                  </Button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {
        // Error and pending states need to be implemented when integrating with the backend
        table.getRowModel().rows.length < 1 ? (
          <caption className="u-visually-hidden">No data</caption> // TableCaption.Title and TableCaption.Description implementation in Site Manager pretty clean, could copy over
        ) : (
          <DynamicTable.Body>
            {table.getRowModel().rows.map((row) => {
              const { getIsGrouped, id, index, getVisibleCells } = row;
              const isIndividualRow = !getIsGrouped();
              return (
                <tr
                  className={classNames({
                    "individual-row": isIndividualRow,
                    "group-row": !isIndividualRow,
                  })}
                  key={id + index}
                >
                  {getVisibleCells()
                    .filter((cell) => filterCells(row, cell.column))
                    .map((cell) => {
                      const { column, id: cellId } = cell;
                      return (
                        <td
                          className={classNames(`${cell.column.id}`)}
                          key={cellId}
                        >
                          {flexRender(column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </DynamicTable.Body>
        )
      }
    </DynamicTable>
  );
};

export default GenericTable;
