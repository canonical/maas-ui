import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom-v5-compat";

import PoolList from "./PoolList";

import MainContentSection from "app/base/components/MainContentSection";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import { useFetchActions } from "app/base/hooks";
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

  const { machineCount } = useFetchMachineCount();

  useFetchActions([resourcePoolActions.fetch]);

  const resourcePoolsCount = useSelector(resourcePoolSelectors.count);

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
              in {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
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
