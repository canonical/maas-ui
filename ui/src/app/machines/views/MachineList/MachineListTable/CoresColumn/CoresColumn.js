import { Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import DoubleRow from "app/base/components/DoubleRow";
import ScriptStatus from "app/base/components/ScriptStatus";
import machineSelectors from "app/store/machine/selectors";

export const CoresColumn = ({ systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getById(state, systemId)
  );

  const formatShortArch = (arch) =>
    arch.includes("/generic") ? arch.split("/")[0] : arch;

  return (
    <DoubleRow
      className="u-align--right"
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
      primaryClassName="u-align--right"
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
  systemId: PropTypes.string.isRequired,
};

export default React.memo(CoresColumn);
