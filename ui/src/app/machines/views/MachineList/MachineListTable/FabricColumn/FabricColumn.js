import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import machineSelectors from "app/store/machine/selectors";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";
import LegacyLink from "app/base/components/LegacyLink";

export const FabricColumn = ({ systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );

  const fabricID = machine.vlan && machine.vlan.fabric_id;
  const fabricName = machine.vlan && machine.vlan.fabric_name;
  const vlan = machine.vlan && machine.vlan.name ? machine.vlan.name : "";

  return (
    <DoubleRow
      primary={
        <ScriptStatus
          data-test="fabric"
          hidePassedIcon
          hideNotRunIcon
          scriptType={machine.network_test_status}
          tooltipPosition="top-left"
        >
          {fabricName ? (
            <LegacyLink className="p-link--soft" route={`/fabric/${fabricID}`}>
              {fabricName}
            </LegacyLink>
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
  systemId: PropTypes.string.isRequired,
};

export default React.memo(FabricColumn);
