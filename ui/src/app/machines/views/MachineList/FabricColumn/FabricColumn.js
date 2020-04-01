import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";
import { machine as machineSelectors } from "app/base/selectors";

const FabricColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const fabric =
    machine.vlan && machine.vlan.fabric_name ? machine.vlan.fabric_name : "-";
  const vlan = machine.vlan && machine.vlan.name ? machine.vlan.name : "";

  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={
        <ScriptStatus
          data-test="fabric"
          hidePassedIcon
          hideNotRunIcon
          scriptType={machine.network_test_status}
          tooltipPosition="top-right"
        >
          {fabric}
        </ScriptStatus>
      }
      primaryAriaLabel="Fabric"
      secondary={<span data-test="vlan">{vlan}</span>}
      secondaryAriaLabel="VLAN"
    />
  );
};

FabricColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default FabricColumn;
