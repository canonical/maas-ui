import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";

const DisksColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={
        <ScriptStatus
          data-test="disks"
          hidePassedIcon
          scriptType={machine.storage_test_status}
          tooltipPosition="top-right"
        >
          {machine.physical_disk_count}
        </ScriptStatus>
      }
      primaryClassName="u-align--right"
    />
  );
};

DisksColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default DisksColumn;
