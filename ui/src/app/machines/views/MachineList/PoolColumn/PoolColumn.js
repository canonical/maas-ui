import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PoolColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={
        <span data-test="pool">
          <a className="p-link--soft" href="#/pools" title={machine.pool.name}>
            {machine.pool.name}
          </a>
        </span>
      }
      primaryAriaLabel="Pool"
      secondary={
        <span title={machine.description} data-test="note">
          {machine.description}
        </span>
      }
      secondaryAriaLabel="Note"
    />
  );
};

PoolColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired
};

export default PoolColumn;
