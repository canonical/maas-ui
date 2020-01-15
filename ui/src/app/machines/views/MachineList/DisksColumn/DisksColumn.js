import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import ScriptStatus from "app/base/components/ScriptStatus";

const DisksColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row u-align--right">
        <ScriptStatus
          data-test="disks"
          hidePassedIcon
          scriptType={machine.storage_test_status}
          tooltipPosition="top-right"
        >
          {machine.physical_disk_count}
        </ScriptStatus>
      </div>
    </div>
  );
};

DisksColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default DisksColumn;
