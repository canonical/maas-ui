import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import Tooltip from "app/base/components/Tooltip";
import { machine as machineSelectors } from "app/base/selectors";

const getSpaces = machine => {
  if (machine.spaces.length > 1) {
    const sorted = [...machine.spaces].sort();
    return (
      <Tooltip position="btm-left" message={sorted.join("\n")}>
        <span data-test="spaces">{`${machine.spaces.length} spaces`}</span>
      </Tooltip>
    );
  }
  return <span data-test="spaces">{machine.spaces[0]}</span>;
};

const ZoneColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row u-truncate">
        <span data-test="zone">{machine.zone.name}</span>
      </div>
      <div className="p-double-row__secondary-row u-truncate">
        {getSpaces(machine)}
      </div>
    </div>
  );
};

ZoneColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default ZoneColumn;
