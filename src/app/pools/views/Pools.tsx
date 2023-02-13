import { useEffect } from "react";

import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom-v5-compat";

import PoolList from "./PoolList";

import MainContentSection from "app/base/components/MainContentSection";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { getRelativeRoute } from "app/utils";

const Pools = (): JSX.Element => {
  const base = urls.pools.index;
  const dispatch = useDispatch();
  const { machineCount } = useFetchMachineCount();

  useEffect(() => {
    dispatch(resourcePoolActions.fetch());
  }, [dispatch]);

  const resourcePools = useSelector(resourcePoolSelectors.all);

  return (
    <MainContentSection
      header={
        <MachinesHeader
          buttons={[
            <Button data-testid="add-pool" element={Link} to={urls.pools.add}>
              Add pool
            </Button>,
          ]}
          machineCount={machineCount}
          title={
            <>
              <Link to={urls.machines.index}>{machineCount} machines </Link>
              in {resourcePools.length}{" "}
              {pluralize("pool", resourcePools.length)}
            </>
          }
        />
      }
    >
      <Routes>
        <Route
          element={<PoolList />}
          path={getRelativeRoute(urls.pools.index, base)}
        />
        <Route
          element={<PoolAdd />}
          path={getRelativeRoute(urls.pools.add, base)}
        />
        <Route
          element={<PoolEdit />}
          path={getRelativeRoute(urls.pools.edit(null), base)}
        />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </MainContentSection>
  );
};

export default Pools;
