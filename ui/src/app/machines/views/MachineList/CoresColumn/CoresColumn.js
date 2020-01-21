import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import Tooltip from "app/base/components/Tooltip";

import ScriptStatus from "app/base/components/ScriptStatus";
import { machine as machineSelectors } from "app/base/selectors";

const CoresColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const formatShortArch = arch =>
    arch.includes("/generic") ? arch.split("/")[0] : arch;

  return (
    <div className="p-double-row u-align--right">
      <div className="p-double-row__primary-row u-truncate" aria-label="Cores">
        <ScriptStatus
          data-test="cores"
          hidePassedIcon
          scriptType={machine.cpu_test_status}
          tooltipPosition="top-right"
        >
          {machine.cpu_count}
        </ScriptStatus>
      </div>
      <div
        className="p-double-row__secondary-row u-truncate"
        aria-label="Architecture"
      >
        <Tooltip position="btm-left" message={machine.architecture}>
          <span data-test="arch">{formatShortArch(machine.architecture)}</span>
        </Tooltip>
      </div>
    </div>
  );
};

CoresColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default CoresColumn;
