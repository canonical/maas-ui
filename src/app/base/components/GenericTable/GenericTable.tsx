import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { Placeholder } from "@canonical/maas-react-components";
import type {
  Column,
  Row,
  ColumnDef,
  ColumnSort,
  GroupingState,
  ExpandedState,
  SortingState,
  Header,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";

import ColumnHeader from "@/app/base/components/GenericTable/ColumnHeader";
import type { PaginationBarProps } from "@/app/base/components/GenericTable/PaginationBar/PaginationBar";
import PaginationBar from "@/app/base/components/GenericTable/PaginationBar/PaginationBar";
import TableCheckbox from "@/app/base/components/GenericTable/TableCheckbox";

import "./_index.scss";

type GenericTableProps<T extends { id: string | number }> = {
  className?: string;
  canSelect?: boolean;
  columns: ColumnDef<T, Partial<T>>[];
  data: T[];
  filterCells?: (row: Row<T>, column: Column<T>) => boolean;
  filterHeaders?: (header: Header<T, unknown>) => boolean;
  groupBy?: string[];
  isLoading: boolean;
  noData?: ReactNode;
  pagination?: PaginationBarProps;
  pinGroup?: { value: string; isTop: boolean }[];
  sortBy?: ColumnSort[];
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  variant?: "full-height" | "regular";
};

const GenericTable = <T extends { id: string | number }>({
  className,
  canSelect = false,
  columns,
  data,
  filterCells = () => true,
  filterHeaders = () => true,
  groupBy,
  isLoading,
  noData,
  pagination,
  pinGroup,
  sortBy,
  rowSelection,
  setRowSelection,
  variant = "full-height",
}: GenericTableProps<T>) => {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [maxHeight, setMaxHeight] = useState("auto");

  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [sorting, setSorting] = useState<SortingState>(sortBy ?? []);

  useEffect(() => {
    const updateHeight = () => {
      const wrapper = tableRef.current;
      const main = document.querySelector("main");

      if (!wrapper || !main) return;

      const mainRect = main.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const availableHeight = mainRect.bottom - wrapperRect.top;
      setMaxHeight(`${availableHeight}px`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (canSelect) {
    columns = [
      {
        id: "select",
        accessorKey: "id",
        enableSorting: false,
        header: "",
        cell: ({ row }) =>
          !row.getIsGrouped() ? <TableCheckbox row={row} /> : null,
      },
      ...columns,
    ];

    if (groupBy) {
      columns = [
        {
          id: "group-select",
          accessorKey: "id",
          enableSorting: false,
          header: ({ table }) => <TableCheckbox.All table={table} />,
          cell: ({ row }) =>
            row.getIsGrouped() ? <TableCheckbox.Group row={row} /> : null,
        },
        ...columns,
      ];
    }
  }

  data = useMemo(() => {
    return [...data].sort((a, b) => {
      if (pinGroup && pinGroup.length > 0 && grouping.length > 0) {
        for (const { value, isTop } of pinGroup) {
          const groupId = grouping[0];
          const aValue = a[groupId as keyof typeof a];
          const bValue = b[groupId as keyof typeof b];

          if (aValue === value && bValue !== value) {
            return isTop ? -1 : 1;
          }
          if (bValue === value && aValue !== value) {
            return isTop ? 1 : -1;
          }
        }
      }

      for (const groupId of grouping) {
        const aGroupValue = a[groupId as keyof typeof a];
        const bGroupValue = b[groupId as keyof typeof b];
        if (aGroupValue < bGroupValue) {
          return -1;
        }
        if (aGroupValue > bGroupValue) {
          return 1;
        }
      }

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
  }, [data, sorting, grouping, pinGroup]);

  const table = useReactTable<T>({
    data,
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
    enableRowSelection: canSelect,
    enableMultiRowSelection: canSelect,
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  return (
    <div className={classNames("p-generic-table", className)}>
      {pagination ? (
        <PaginationBar
          currentPage={pagination.currentPage}
          dataContext={pagination.dataContext}
          handlePageSizeChange={pagination.handlePageSizeChange}
          isPending={pagination.isPending}
          itemsPerPage={pagination.itemsPerPage}
          setCurrentPage={pagination.setCurrentPage}
          totalItems={pagination.totalItems}
        />
      ) : null}
      <table
        className={classNames("p-generic-table__table", {
          "is-full-height": variant === "full-height",
          "is-selectable": canSelect,
        })}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers
                .filter(filterHeaders)
                .map((header, index) => (
                  <Fragment key={header.id}>
                    <ColumnHeader header={header} />
                    {index === 2 ? <th className="select-alignment" /> : null}
                  </Fragment>
                ))}
            </tr>
          ))}
        </thead>
        <tbody
          ref={tableRef}
          style={{
            overflowY: "auto",
            maxHeight,
          }}
        >
          {isLoading ? (
            Array.from({ length: 10 }, (_, index) => {
              return (
                <tr aria-hidden="true" key={index}>
                  {columns.map((column, columnIndex) => {
                    return (
                      <td
                        className={classNames(
                          column.id,
                          "u-text-overflow-clip"
                        )}
                        key={columnIndex}
                      >
                        <Placeholder isPending text="XXXxxxx.xxxxxxxxx" />
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : table.getRowModel().rows.length < 1 ? (
            <tr>{noData}</tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              const { getIsGrouped, id, getVisibleCells } = row;
              const isIndividualRow = !getIsGrouped();
              return (
                <tr
                  className={classNames({
                    "individual-row": isIndividualRow,
                    "group-row": !isIndividualRow,
                  })}
                  key={id}
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
