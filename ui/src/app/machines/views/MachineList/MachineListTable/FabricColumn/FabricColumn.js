import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { generateLegacyURL } from "app/utils";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";

const FabricColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const fabricID = machine.vlan && machine.vlan.fabric_id;
  const fabricName = machine.vlan && machine.vlan.fabric_name;
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
          tooltipPosition="top-left"
        >
          {fabricName ? (
            <a
              className="p-link--soft"
              href={generateLegacyURL(`/fabric/${fabricID}`)}
            >
              {fabricName}
            </a>
          ) : (
            "-"
          )}
        </ScriptStatus>
      }
      primaryAriaLabel="Fabric"
      primaryTitle={fabricName}
      secondary={<span data-test="vlan">{vlan}</span>}
      secondaryAriaLabel="VLAN"
      secondaryTitle={vlan}
    />
  );
};

FabricColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default FabricColumn;
