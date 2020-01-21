import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";

const ZoneColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const spaces =
    machine.spaces.length > 1
      ? `${machine.spaces.length} spaces`
      : machine.spaces[0];

  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row u-truncate">
        <span data-test="zone">{machine.zone.name}</span>
      </div>
      <div className="p-double-row__secondary-row u-truncate">
        <span data-test="spaces">{spaces}</span>
      </div>
    </div>
  );
};

ZoneColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default ZoneColumn;
