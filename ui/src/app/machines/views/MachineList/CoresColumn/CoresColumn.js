import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";
import Tooltip from "app/base/components/Tooltip";
import { machine as machineSelectors } from "app/base/selectors";

const CoresColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const formatShortArch = arch =>
    arch.includes("/generic") ? arch.split("/")[0] : arch;

  return (
    <DoubleRow
      className="u-align--right"
      onToggleMenu={onToggleMenu}
      primary={
        <ScriptStatus
          data-test="cores"
          hidePassedIcon
          scriptType={machine.cpu_test_status}
          tooltipPosition="top-right"
        >
          {machine.cpu_count}
        </ScriptStatus>
      }
      primaryAriaLabel="Cores"
      secondary={
        <Tooltip position="btm-left" message={machine.architecture}>
          <span data-test="arch">{formatShortArch(machine.architecture)}</span>
        </Tooltip>
      }
      secondaryAriaLabel="Architecture"
    />
  );
};

CoresColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired
};

export default CoresColumn;
