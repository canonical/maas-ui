import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction, RefObject } from "react";

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
  CellContext,
  HeaderContext,
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
  containerRef?: RefObject<HTMLElement>;
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
  columns: initialColumns,
  containerRef,
  data: initialData,
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

  // Update table height based on available space
  useEffect(() => {
    const updateHeight = () => {
      const wrapper = tableRef.current;
      if (!wrapper) return;

      // Use provided containerRef if available, fallback to main
      const container = containerRef?.current || document.querySelector("main");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      const availableHeight = containerRect.bottom - wrapperRect.top;
      setMaxHeight(`${availableHeight}px`);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const wrapper = tableRef.current;
    if (wrapper) resizeObserver.observe(wrapper);

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      if (wrapper) resizeObserver.unobserve(wrapper);
    };
  }, [containerRef]);

  // Add selection columns if needed
  const columns = useMemo(() => {
    if (!canSelect || isLoading) {
      return initialColumns;
    }

    const selectionColumns = [
      {
        id: "p-generic-table__select",
        accessorKey: "id",
        enableSorting: false,
        header: "",
        cell: ({ row }: CellContext<T, Partial<T>>) =>
          !row.getIsGrouped() ? <TableCheckbox row={row} /> : null,
      },
      ...initialColumns,
    ];

    if (groupBy) {
      return [
        {
          id: "p-generic-table__group-select",
          accessorKey: "id",
          enableSorting: false,
          header: ({ table }: HeaderContext<T, Partial<T>>) => (
            <TableCheckbox.All table={table} />
          ),
          cell: ({ row }: CellContext<T, Partial<T>>) =>
            row.getIsGrouped() ? <TableCheckbox.Group row={row} /> : null,
        },
        ...selectionColumns,
      ];
    }

    return selectionColumns;
  }, [canSelect, initialColumns, isLoading, groupBy]);

  // Memoize grouped data
  const groupedData = useMemo(() => {
    if (!grouping.length) return initialData;

    return [...initialData].sort((a, b) => {
      // Sort by group values
      for (const groupId of grouping) {
        const aGroupValue = a[groupId as keyof typeof a] ?? null;
        const bGroupValue = b[groupId as keyof typeof b] ?? null;

        if (aGroupValue === null) return 1;
        if (bGroupValue === null) return -1;

        if (aGroupValue < bGroupValue) return -1;
        if (aGroupValue > bGroupValue) return 1;
      }
      return 0;
    });
  }, [initialData, grouping]);

  // Sort data based on pinning and sorting preferences
  const sortedData = useMemo(() => {
    if (!groupedData.length) return [];

    return [...groupedData].sort((a, b) => {
      // Handle pinned groups
      if (pinGroup?.length && grouping.length) {
        for (const { value, isTop } of pinGroup) {
          const groupId = grouping[0];
          const aValue = a[groupId as keyof typeof a] ?? null;
          const bValue = b[groupId as keyof typeof b] ?? null;

          if (aValue === value && bValue !== value) {
            return isTop ? -1 : 1;
          }
          if (bValue === value && aValue !== value) {
            return isTop ? 1 : -1;
          }
        }
      }

      // Sort by column sorting
      for (const { id, desc } of sorting) {
        const aValue = a[id as keyof typeof a] ?? null;
        const bValue = b[id as keyof typeof b] ?? null;

        // Handle null values
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return desc ? -1 : 1;
        if (bValue === null) return desc ? 1 : -1;

        if (aValue < bValue) {
          return desc ? 1 : -1;
        }
        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
      }

      return 0;
    });
  }, [groupedData, sorting, pinGroup, grouping]);

  // Configure table
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
    enableRowSelection: canSelect,
    enableMultiRowSelection: canSelect,
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  // Render loading placeholder rows
  const renderLoadingRows = () => {
    return Array.from({ length: 10 }, (_, index) => (
      <tr aria-hidden="true" key={index}>
        {columns.map((column, columnIndex) => (
          <td className={column.id} key={columnIndex}>
            <Placeholder isPending text="XXXxxxx.xxxxxxxxx" />
          </td>
        ))}
      </tr>
    ));
  };

  // Render data rows
  const renderDataRows = () => {
    if (table.getRowModel().rows.length < 1) {
      return (
        <tr>
          <td
            className="p-generic-table__no-data"
            colSpan={columns.length}
            role="cell"
          >
            {noData}
          </td>
        </tr>
      );
    }

    return table.getRowModel().rows.map((row) => {
      const { getIsGrouped, id, getVisibleCells } = row;
      const isIndividualRow = !getIsGrouped();
      const isSelected =
        rowSelection !== undefined && Object.keys(rowSelection!).includes(id);

      return (
        <tr
          aria-rowindex={parseInt(id.replace(/\D/g, "") || "0", 10) + 1}
          aria-selected={isSelected}
          className={classNames({
            "p-generic-table__individual-row": isIndividualRow,
            "p-generic-table__group-row": !isIndividualRow,
          })}
          key={id}
          role="row"
        >
          {getVisibleCells()
            .filter((cell) => {
              if (
                !isIndividualRow &&
                cell.column.id === "p-generic-table__group-select"
              )
                return true;
              return filterCells(row, cell.column);
            })
            .map((cell) => (
              <td
                className={classNames(`${cell.column.id}`)}
                key={cell.id}
                role="cell"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
        </tr>
      );
    });
  };

  return (
    <div className={classNames("p-generic-table", className)}>
      {pagination && (
        <PaginationBar
          currentPage={pagination.currentPage}
          dataContext={pagination.dataContext}
          handlePageSizeChange={pagination.handlePageSizeChange}
          isPending={pagination.isPending}
          itemsPerPage={pagination.itemsPerPage}
          setCurrentPage={pagination.setCurrentPage}
          totalItems={pagination.totalItems}
        />
      )}

      <table
        aria-busy={isLoading}
        aria-describedby="generic-table-description"
        aria-rowcount={sortedData.length + 1} // +1 for header row
        className={classNames("p-generic-table__table", {
          "p-generic-table__is-full-height": variant === "full-height",
          "p-generic-table__is-selectable": canSelect,
        })}
        role="grid"
      >
        <thead role="rowgroup">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} role="row">
              {headerGroup.headers
                .filter(filterHeaders)
                .map((header, index) => (
                  <Fragment key={header.id}>
                    <ColumnHeader header={header} />
                    {index === 2 ? (
                      <th
                        className="p-generic-table__select-alignment"
                        role="columnheader"
                      />
                    ) : null}
                  </Fragment>
                ))}
            </tr>
          ))}
        </thead>

        <tbody
          ref={tableRef}
          role="rowgroup"
          style={{
            overflowY: "auto",
            maxHeight,
          }}
        >
          {isLoading ? renderLoadingRows() : renderDataRows()}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
