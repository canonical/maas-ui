import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import Tooltip from "app/base/components/Tooltip";
import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

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

const ZoneColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={<span data-test="zone">{machine.zone.name}</span>}
      secondary={getSpaces(machine)}
    />
  );
};

ZoneColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired
};

export default ZoneColumn;
