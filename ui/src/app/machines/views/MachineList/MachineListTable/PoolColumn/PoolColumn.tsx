import { memo, useEffect, useState } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import { useToggleMenu } from "app/machines/hooks";
import poolsURLs from "app/pools/urls";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import type {
  ResourcePool,
  ResourcePoolMeta,
} from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  onToggleMenu?: (systemId: Machine[MachineMeta.PK], open: boolean) => void;
  systemId: Machine[MachineMeta.PK];
};

export const PoolColumn = ({
  onToggleMenu,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState<
    ResourcePool[ResourcePoolMeta.PK] | null
  >(null);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const toggleMenu = useToggleMenu(onToggleMenu || null, systemId);

  let poolLinks;
  const machinePools = resourcePools.filter(
    (pool) => pool.id !== machine?.pool.id
  );
  if (machine?.actions.includes(NodeActions.SET_POOL)) {
    if (machinePools.length !== 0) {
      poolLinks = machinePools.map((pool) => ({
        children: pool.name,
        "data-testid": "change-pool-link",
        onClick: () => {
          dispatch(machineActions.setPool({ systemId, poolId: pool.id }));
          setUpdating(pool.id);
        },
      }));
    } else {
      poolLinks = [{ children: "No other pools available", disabled: true }];
    }
  } else {
    poolLinks = [
      { children: "Cannot change pool of this machine", disabled: true },
    ];
  }

  useEffect(() => {
    if (updating !== null && machine?.pool.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine?.pool.id]);

  if (!machine) {
    return null;
  }

  return (
    <DoubleRow
      menuLinks={onToggleMenu && poolLinks}
      menuTitle="Change pool:"
      onToggleMenu={toggleMenu}
      primary={
        <span data-testid="pool">
          {updating !== null ? (
            <Spinner className="u-nudge-left--small" />
          ) : null}
          <Link className="p-link--soft" to={poolsURLs.pools}>
            {machine.pool.name}
          </Link>
        </span>
      }
      primaryAriaLabel="Pool"
      primaryTitle={machine.pool.name}
      secondary={
        <span title={machine.description} data-testid="note">
          {machine.description}
        </span>
      }
      secondaryAriaLabel="Note"
      secondaryTitle={machine.description}
    />
  );
};

export default memo(PoolColumn);
