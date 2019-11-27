import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./SettingsTable.scss";
import {
  Button,
  Loader,
  MainTable,
  SearchBox
} from "@canonical/react-components";
import Tooltip from "app/base/components/Tooltip";

export const SettingsTable = ({
  buttons,
  defaultSort,
  headers,
  loaded,
  loading,
  rows,
  searchOnChange,
  searchPlaceholder,
  searchText,
  tableClassName
}) => {
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
        {buttons.map(({ label, url, disabled = false, tooltip }) =>
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
          <Loader />
        </div>
      )}
      <MainTable
        className={classNames("p-table-expanding--light", tableClassName, {
          "u-no-padding--bottom": loading && !loaded
        })}
        defaultSort={defaultSort}
        defaultSortDirection="ascending"
        expanding={true}
        headers={headers}
        paginate={20}
        rows={loaded ? rows : null}
        sortable
      />
      {loading && !loaded && <div className="settings-table__lines"></div>}
    </div>
  );
};

SettingsTable.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      tooltip: PropTypes.string
    })
  ).isRequired,
  defaultSort: PropTypes.string,
  headers: PropTypes.array,
  loaded: PropTypes.bool,
  loading: PropTypes.bool,
  rows: PropTypes.array,
  searchOnChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchText: PropTypes.string,
  tableClassName: PropTypes.string
};

export default SettingsTable;
