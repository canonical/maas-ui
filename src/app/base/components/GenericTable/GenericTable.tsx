import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useMemo,
  useState,
} from "react";

import { DynamicTable } from "@canonical/maas-react-components";
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

import TableCheckbox from "@/app/base/components/GenericTable/TableCheckbox";
import TableHeader from "@/app/base/components/GenericTable/TableHeader";

import "./_index.scss";

type GenericTableProps<T> = {
  canSelect?: boolean;
  columns: ColumnDef<T, Partial<T>>[];
  data: T[];
  filterCells?: (row: Row<T>, column: Column<T>) => boolean;
  filterHeaders?: (header: Header<T, unknown>) => boolean;
  groupBy?: string[];
  noData?: ReactNode;
  pin?: { value: string; isTop: boolean }[];
  sortBy?: ColumnSort[];
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
};

const GenericTable = <T,>({
  canSelect = false,
  columns,
  data,
  filterCells = () => true,
  filterHeaders = () => true,
  groupBy,
  noData,
  pin,
  sortBy,
  rowSelection,
  setRowSelection,
}: GenericTableProps<T>) => {
  const [grouping, setGrouping] = useState<GroupingState>(groupBy ?? []);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [sorting, setSorting] = useState<SortingState>(sortBy ?? []);

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
      if (pin && pin.length > 0 && grouping.length > 0) {
        for (const { value, isTop } of pin) {
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
  }, [data, sorting, grouping, pin]);

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
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  return (
    <DynamicTable className="p-generic-table" variant="full-height">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.filter(filterHeaders).map((header) => (
              <TableHeader header={header} key={header.id} />
            ))}
          </tr>
        ))}
      </thead>
      {table.getRowModel().rows.length < 1 ? (
        noData
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
      )}
    </DynamicTable>
  );
};

export default GenericTable;
