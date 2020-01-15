import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import Tooltip from "app/base/components/Tooltip";

import { machine as machineSelectors } from "app/base/selectors";

const CoresColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  const formatShortArch = arch =>
    arch.includes("/generic") ? arch.split("/")[0] : arch;

  return (
    <div className="p-double-row u-align--right">
      <div className="p-double-row__primary-row" aria-label="Cores">
        <span data-test="cores">{machine.cpu_count}</span>
      </div>
      <div
        className="p-double-row__secondary-row u-truncate-text"
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
