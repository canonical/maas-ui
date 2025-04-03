import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { Link, Route, Routes } from "react-router-dom";

import PoolDelete from "./PoolDelete";
import PoolList from "./PoolList";

import { usePoolCount } from "@/app/api/query/pools";
import PageContent from "@/app/base/components/PageContent";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import PoolAdd from "@/app/pools/views/PoolAdd";
import PoolEdit from "@/app/pools/views/PoolEdit";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";
import { getRelativeRoute } from "@/app/utils";

const Pools = (): JSX.Element => {
  const base = urls.pools.index;

  const { machineCount } = useFetchMachineCount();

  const resourcePoolsCount = usePoolCount();
  const count = resourcePoolsCount?.data ?? resourcePoolsCount.data;

  const PoolsHeader = () => (
    <MainToolbar>
      <MainToolbar.Title>
        <Link to={urls.machines.index}>{machineCount} machines</Link>
        {` in ${count} ${pluralize("pool", count)}`}
      </MainToolbar.Title>
      <MainToolbar.Controls>
        <Button data-testid="add-pool" element={Link} to={urls.pools.add}>
          Add pool
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );

  return (
    <Routes>
      <Route
        element={
          <PageContent
            header={<PoolsHeader />}
            sidePanelContent={null}
            sidePanelTitle={null}
          >
            <PoolList />
          </PageContent>
        }
        path={getRelativeRoute(urls.pools.index, base)}
      />
      <Route
        element={
          <PageContent
            header={<PoolsHeader />}
            sidePanelContent={<PoolAdd />}
            sidePanelTitle="Add pool"
          >
            <PoolList />
          </PageContent>
        }
        path={getRelativeRoute(urls.pools.add, base)}
      />
      <Route
        element={
          <PageContent
            header={<PoolsHeader />}
            sidePanelContent={<PoolEdit />}
            sidePanelTitle="Edit pool"
          >
            <PoolList />
          </PageContent>
        }
        path={getRelativeRoute(urls.pools.edit(null), base)}
      />
      <Route
        element={
          <PageContent
            header={<PoolsHeader />}
            sidePanelContent={<PoolDelete />}
            sidePanelTitle="Delete pool"
          >
            <PoolList />
          </PageContent>
        }
        path={getRelativeRoute(urls.pools.delete(null), base)}
      />
      <Route
        element={
          <PageContent
            header={<PoolsHeader />}
            sidePanelContent={null}
            sidePanelTitle={null}
          >
            <NotFound />
          </PageContent>
        }
        path="*"
      />
    </Routes>
  );
};

export default Pools;
