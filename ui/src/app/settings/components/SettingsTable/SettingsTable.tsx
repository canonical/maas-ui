import type { HTMLProps, ReactNode } from "react";

import {
  Button,
  Link as VanillaLink,
  MainTable,
  SearchBox,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import { Link } from "react-router-dom";

// TODO: these should eventually use the react-components types
// when they have been migrated to TypeScript.
type MainTableHeader = {
  /**
   * The content of the table header.
   */
  content?: ReactNode;
  /**
   * Optional classes to apply to the table header.
   */
  className?: string | null;
  /**
   * A key to sort the rows by. It should match a key given to the row `sortData`.
   */
  sortKey?: string | null;
} & Omit<HTMLProps<HTMLTableHeaderCellElement>, "content">;

type TableCellProps = {
  /**
   * The content of the table cell.
   */
  children?: ReactNode;
  /**
   * Optional class(es) to pass to the wrapping td element.
   */
  className?: string | null;
  /**
   * Whether the cell is an expanded cell.
   */
  expanding?: boolean;
  /**
   * Whether content of the cell should be able to overflow, e.g. a dropdown.
   */
  hasOverflow?: boolean;
  /**
   * Whether the cell is currently hidden.
   */
  hidden?: boolean;
} & HTMLProps<HTMLTableCellElement>;

type MainTableCell = {
  /**
   * The content of the table cell.
   */
  content?: ReactNode;
} & Omit<TableCellProps, "children" | "content">;

type MainTableRow = {
  /**
   * Optional class(es) to apply to the row.
   */
  className?: string | null;
  /**
   * The columns in this row.
   */
  columns?: MainTableCell[];
  /**
   * Whether this row should display as expanded.
   */
  expanded?: boolean;
  /**
   * The content to display when this column is expanded.
   */
  expandedContent?: ReactNode;
  /**
   * An optional key to identify this table row.
   */
  key?: number | string | null;
  /**
   * An object of data for use when sorting the rows. The keys of this object
   * should match the header sort keys.
   */
  sortData?: Record<string, unknown>;
} & Omit<HTMLProps<HTMLTableRowElement>, "className">;

export type TableButtons = {
  disabled?: boolean;
  label: string;
  tooltip?: string | null;
  url: string;
};

export type Props = {
  buttons?: TableButtons[];
  defaultSort?: string;
  headers?: MainTableHeader[];
  helpLabel?: string;
  helpLink?: string;
  loaded?: boolean;
  loading?: boolean;
  rows?: MainTableRow[];
  searchOnChange?: (inputValue: string) => void;
  searchPlaceholder?: string;
  searchText?: string;
  tableClassName?: string;
};

export const SettingsTable = ({
  buttons,
  defaultSort,
  headers,
  helpLabel,
  helpLink,
  loaded,
  loading,
  rows,
  searchOnChange,
  searchPlaceholder,
  searchText,
  tableClassName,
  ...tableProps
}: Props): JSX.Element => {
  return (
    <div className="settings-table">
      <div className="p-table-actions">
        {searchOnChange ? (
          <SearchBox
            onChange={searchOnChange}
            placeholder={searchPlaceholder}
            value={searchText}
          />
        ) : (
          <div className="p-table-actions__space-left"></div>
        )}
        {buttons?.map(({ label, url, disabled = false, tooltip }) =>
          tooltip ? (
            <Tooltip key={url} position="left" message={tooltip}>
              <Button element={Link} to={url} disabled={disabled}>
                {label}
              </Button>
            </Tooltip>
          ) : (
            <Button element={Link} to={url} key={url} disabled={disabled}>
              {label}
            </Button>
          )
        )}
      </div>
      {loading && (
        <div className="settings-table__loader">
          <Spinner />
        </div>
      )}
      <MainTable
        className={classNames("p-table-expanding--light", tableClassName, {
          "u-no-padding--bottom": loading && !loaded,
        })}
        defaultSort={defaultSort}
        defaultSortDirection="ascending"
        expanding={true}
        headers={headers}
        paginate={20}
        rows={loaded ? rows : null}
        sortable
        {...tableProps}
      />
      {loading && !loaded && <div className="settings-table__lines"></div>}
      {helpLink && helpLabel ? (
        <p className="u-no-margin--bottom settings-table__help">
          <VanillaLink
            external
            href={helpLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            {helpLabel}
          </VanillaLink>
        </p>
      ) : null}
    </div>
  );
};

export default SettingsTable;
