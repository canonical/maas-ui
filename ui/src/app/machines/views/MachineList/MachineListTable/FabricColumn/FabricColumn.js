import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import machineSelectors from "app/store/machine/selectors";
import { generateLegacyURL } from "app/utils";
import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";

export const FabricColumn = ({ systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );

  const fabricID = machine.vlan && machine.vlan.fabric_id;
  const fabricName = machine.vlan && machine.vlan.fabric_name;
  const fabricURL = generateLegacyURL(`/fabric/${fabricID}`);
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
            <a
              className="p-link--soft"
              href={generateLegacyURL(`/fabric/${fabricID}`)}
              onClick={(evt) => {
                evt.preventDefault();
                window.history.pushState(null, null, fabricURL);
              }}
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
  systemId: PropTypes.string.isRequired,
};

export default React.memo(FabricColumn);
