import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";
import ScriptStatus from "app/base/components/ScriptStatus";

const RamColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row u-align--right u-truncate">
        <ScriptStatus
          hidePassedIcon
          scriptType={machine.memory_test_status}
          tooltipPosition="top-right"
        >
          <span data-test="memory">{machine.memory}</span>&nbsp;
          <small className="u-text--light">GiB</small>
        </ScriptStatus>
      </div>
    </div>
  );
};

RamColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default RamColumn;
