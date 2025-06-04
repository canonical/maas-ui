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
import { Link } from "react-router";

import SearchBox from "@/app/base/components/SearchBox";

export type TableButtons = {
  disabled?: boolean;
  label: string;
  tooltip?: string | null;
  url: string;
};

export type Props = {
  readonly buttons?: TableButtons[];
  readonly defaultSort?: string;
  readonly emptyStateMsg?: MainTableProps["emptyStateMsg"];
  readonly headers?: MainTableProps["headers"];
  readonly helpLabel?: string;
  readonly helpLink?: string;
  readonly loaded?: boolean;
  readonly loading?: boolean;
  readonly rows?: MainTableProps["rows"];
  readonly searchOnChange?: (inputValue: string) => void;
  readonly searchPlaceholder?: string;
  readonly searchText?: string;
  readonly tableClassName?: string;
  readonly title?: string;
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
}: Props): React.ReactElement => {
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
