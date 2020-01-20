import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { formatBytes } from "app/utils";

const StorageColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const formattedStorage = formatBytes(machine.storage, "GB");

  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row u-align--right u-truncate">
        <span data-test="storage-value">{formattedStorage.value}</span>&nbsp;
        <small className="u-text--light" data-test="storage-unit">
          {formattedStorage.unit}
        </small>
      </div>
    </div>
  );
};

StorageColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default StorageColumn;
