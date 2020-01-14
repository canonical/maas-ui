import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { machine as machineSelectors } from "app/base/selectors";

const PoolColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );

  return (
    <>
      <div className="p-double-row__primary-row" aria-label="Pool">
        <span data-test="pool">
          <a className="p-link--soft" href="#/pools" title={machine.pool.name}>
            {machine.pool.name}
          </a>
        </span>
      </div>
      <div
        className="p-double-row__secondary-row u-truncate-text"
        aria-label="Note"
      >
        <span title={machine.description} data-test="note">
          {machine.description}
        </span>
      </div>
    </>
  );
};

PoolColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default PoolColumn;
