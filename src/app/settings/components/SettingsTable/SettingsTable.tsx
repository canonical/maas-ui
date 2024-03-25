import { MainToolbar } from "@canonical/maas-react-components";
import {
  Button,
  Link as VanillaLink,
  MainTable,
  Spinner,
  Tooltip,
} from "@canonical/react-components";
import type { MainTableProps } from "@canonical/react-components";
import classNames from "classnames";
import { Link } from "react-router-dom";

import SearchBox from "@/app/base/components/SearchBox";

export type TableButtons = {
  disabled?: boolean;
  label: string;
  tooltip?: string | null;
  url: string;
};

export type Props = {
  buttons?: TableButtons[];
  defaultSort?: string;
  emptyStateMsg?: MainTableProps["emptyStateMsg"];
  headers?: MainTableProps["headers"];
  helpLabel?: string;
  helpLink?: string;
  loaded?: boolean;
  loading?: boolean;
  rows?: MainTableProps["rows"];
  searchOnChange?: (inputValue: string) => void;
  searchPlaceholder?: string;
  searchText?: string;
  tableClassName?: string;
  title?: string;
};

export const SettingsTable = ({
  buttons,
  defaultSort,
  emptyStateMsg,
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
  title,
  ...tableProps
}: Props): JSX.Element => {
  return (
    <div className="settings-table">
      <MainToolbar>
        {title && <MainToolbar.Title>{title}</MainToolbar.Title>}
        <MainToolbar.Controls>
          {searchOnChange ? (
            <SearchBox
              onChange={searchOnChange}
              placeholder={searchPlaceholder}
              value={searchText}
            />
          ) : null}
          {buttons?.map(({ label, url, disabled = false, tooltip }) =>
            tooltip ? (
              <Tooltip key={url} message={tooltip} position="left">
                <Button disabled={disabled} element={Link} to={url}>
                  {label}
                </Button>
              </Tooltip>
            ) : (
              <Button disabled={disabled} element={Link} key={url} to={url}>
                {label}
              </Button>
            )
          )}
        </MainToolbar.Controls>
      </MainToolbar>
      {loading && (
        <div className="settings-table__loader">
          <Spinner />
        </div>
      )}
      <MainTable
        className={classNames(
          "p-table-expanding--light u-nudge-down",
          tableClassName,
          {
            "u-no-padding--bottom": loading && !loaded,
          }
        )}
        defaultSort={defaultSort}
        defaultSortDirection="ascending"
        emptyStateMsg={emptyStateMsg}
        expanding={true}
        headers={headers}
        paginate={20}
        rows={loaded ? rows : undefined}
        sortable
        {...tableProps}
      />
      {loading && !loaded && <div className="settings-table__lines"></div>}
      {helpLink && helpLabel ? (
        <p className="u-no-margin--bottom settings-table__help">
          <VanillaLink
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
