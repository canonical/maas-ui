import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { formatBytes } from "app/utils";
import DoubleRow from "app/base/components/DoubleRow";

export const StorageColumn = ({ systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const formattedStorage = formatBytes(machine.storage, "GB");

  return (
    <DoubleRow
      primary={
        <>
          <span data-test="storage-value">{formattedStorage.value}</span>&nbsp;
          <small className="u-text--light" data-test="storage-unit">
            {formattedStorage.unit}
          </small>
        </>
      }
      primaryClassName="u-align--right"
    />
  );
};

StorageColumn.propTypes = {
  systemId: PropTypes.string.isRequired,
};

export default React.memo(StorageColumn);
