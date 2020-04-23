import { Loader } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
} from "app/base/selectors";
import DoubleRow from "app/base/components/DoubleRow";

const PoolColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const resourcePools = useSelector(resourcePoolSelectors.all);
  let pools = resourcePools
    .filter((pool) => pool.id !== machine.pool.id)
    .map((pool) => ({
      children: pool.name,
      onClick: () => {
        dispatch(machineActions.setPool(systemId, pool.id));
        setUpdating(pool.id);
      },
    }));
  if (pools.length === 0) {
    pools = [{ children: "No other pools available", disabled: true }];
  }

  useEffect(() => {
    if (updating !== null && machine.pool.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine.pool.id]);

  return (
    <DoubleRow
      menuLinks={pools}
      menuTitle="Change pool:"
      onToggleMenu={onToggleMenu}
      primary={
        <span data-test="pool">
          {updating !== null ? (
            <Loader className="u-no-margin u-no-padding--left" inline />
          ) : null}
          <Link className="p-link--soft" to="/pools">
            {machine.pool.name}
          </Link>
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
  systemId: PropTypes.string.isRequired,
};

export default PoolColumn;
