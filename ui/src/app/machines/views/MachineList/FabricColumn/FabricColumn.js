import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import ScriptStatus from "app/base/components/ScriptStatus";
import { machine as machineSelectors } from "app/base/selectors";

const FabricColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const fabric =
    machine.vlan && machine.vlan.fabric_name ? machine.vlan.fabric_name : "-";
  const vlan = machine.vlan && machine.vlan.name ? machine.vlan.name : "";

  return (
    <div className="p-double-row">
      <div className="p-double-row__primary-row" aria-label="Fabric">
        <ScriptStatus
          data-test="fabric"
          hidePassedIcon
          hideNotRunIcon
          scriptType={machine.network_test_status}
          tooltipPosition="top-right"
        >
          {fabric}
        </ScriptStatus>
      </div>
      <div
        className="p-double-row__secondary-row u-truncate-text"
        aria-label="VLAN"
      >
        <span data-test="vlan">{vlan}</span>
      </div>
    </div>
  );
};

FabricColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default FabricColumn;
