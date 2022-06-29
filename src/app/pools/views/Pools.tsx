import { Button } from "@canonical/react-components";
import { Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";

import PoolList from "./PoolList";

import Section from "app/base/components/Section";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";

const Pools = (): JSX.Element => (
  <Section
    header={
      <MachinesHeader
        buttons={[
          <Button data-testid="add-pool" element={Link} to={urls.pools.add}>
            Add pool
          </Button>,
        ]}
      />
    }
  >
    <Switch>
      <Route exact path={urls.pools.index} render={() => <PoolList />} />
      <Route exact path={urls.pools.add} render={() => <PoolAdd />} />
      <Route exact path={urls.pools.edit(null)} render={() => <PoolEdit />} />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  </Section>
);

export default Pools;
