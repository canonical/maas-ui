import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors
} from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PoolColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const resourcePools = useSelector(resourcePoolSelectors.all);
  let pools = resourcePools.map(pool => ({
    children: pool.name,
    onClick: () => {
      dispatch(machineActions.setPool(systemId, pool.id));
    }
  }));
  if (pools.length === 1) {
    pools = [{ children: "No other pools available", disabled: true }];
  }
  return (
    <DoubleRow
      menuLinks={pools}
      menuTitle="Change pool:"
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
