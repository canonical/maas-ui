import type { CheckboxInputProps } from "@canonical/react-components";
import type { Row, Table } from "@tanstack/react-table";

type TableCheckboxProps<T> = {
  row?: Row<T>;
  table?: Table<T>;
} & Partial<CheckboxInputProps>;

const TableAllCheckbox = <T,>({ table, ...props }: TableCheckboxProps<T>) => {
  if (!table) {
    return null;
  }

  let checked: boolean | "false" | "mixed" | "true" | undefined;
  if (table.getSelectedRowModel().rows.length === 0) {
    checked = "false";
  } else if (
    table.getSelectedRowModel().rows.length <
    table.getRowCount() - table.getGroupedRowModel().rows.length
  ) {
    checked = "mixed";
  } else {
    checked = "true";
  }

  return (
    <label className="p-checkbox--inline">
      <input
        aria-checked={checked}
        aria-label="select all"
        className="p-checkbox__input"
        type="checkbox"
        {...{
          checked: checked === "true",
          onChange: () => {
            if (table.getIsAllPageRowsSelected()) {
              table?.toggleAllPageRowsSelected(false);
            } else {
              table?.toggleAllPageRowsSelected(true);
            }
          },
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

const TableGroupCheckbox = <T,>({ row, ...props }: TableCheckboxProps<T>) => {
  if (!row) {
    return null;
  }
  const isSomeSubRowsSelected =
    !row.getIsAllSubRowsSelected() && row.getIsSomeSelected();
  return (
    <label className="p-checkbox--inline">
      <input
        aria-checked={isSomeSubRowsSelected ? "mixed" : undefined}
        className="p-checkbox__input"
        type="checkbox"
        {...{
          checked: isSomeSubRowsSelected || row.getIsAllSubRowsSelected(),
          disabled: !row.getCanSelect(),
          onChange: () => {
            if (row?.getIsAllSubRowsSelected()) {
              row?.toggleSelected(false);
              row.subRows.forEach((subRow) => subRow.toggleSelected(false));
            } else {
              row?.toggleSelected(true);
              row.subRows.forEach((subRow) => subRow.toggleSelected(true));
            }
          },
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

const TableCheckbox = <T,>({ row, ...props }: TableCheckboxProps<T>) => {
  if (!row) {
    return null;
  }
  return (
    <label className="p-checkbox--inline">
      <input
        className="p-checkbox__input"
        type="checkbox"
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onChange: row.getToggleSelectedHandler(),
        }}
        {...props}
      />
      <span className="p-checkbox__label" />
    </label>
  );
};

TableCheckbox.All = TableAllCheckbox;
TableCheckbox.Group = TableGroupCheckbox;

export default TableCheckbox;
