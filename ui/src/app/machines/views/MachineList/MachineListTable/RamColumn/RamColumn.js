import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";

const RamColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={
        <ScriptStatus
          hidePassedIcon
          scriptType={machine.memory_test_status}
          tooltipPosition="top-right"
        >
          <span data-test="memory">{machine.memory}</span>&nbsp;
          <small className="u-text--light">GiB</small>
        </ScriptStatus>
      }
      primaryClassName="u-align--right"
    />
  );
};

RamColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default RamColumn;
