import { Button } from "@canonical/react-components";
import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import classNames from "classnames";

import SortingIndicator from "@/app/base/components/GenericTable/SortingIndicator";

type TableHeaderProps<T> = {
  header: Header<T, unknown>;
};

const ColumnHeader = <T,>({ header }: TableHeaderProps<T>) => {
  return (
    <th className={classNames(`${header.column.id}`)} key={header.id}>
      {header.column.getCanSort() ? (
        <Button
          appearance="link"
          className="p-button--table-header"
          onClick={header.column.getToggleSortingHandler()}
          type="button"
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <SortingIndicator header={header} />
        </Button>
      ) : (
        flexRender(header.column.columnDef.header, header.getContext())
      )}
    </th>
  );
};

export default ColumnHeader;
