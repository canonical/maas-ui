import { Button } from "@canonical/react-components";
import { Link, Route, Switch } from "react-router-dom";

import PoolList from "./PoolList";

import Section from "app/base/components/Section";
import MachinesHeader from "app/base/components/node/MachinesHeader";
import NotFound from "app/base/views/NotFound";
import poolsURLs from "app/pools/urls";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";

const Pools = (): JSX.Element => (
  <Section
    header={
      <MachinesHeader
        buttons={[
          <Button data-testid="add-pool" element={Link} to={poolsURLs.add}>
            Add pool
          </Button>,
        ]}
      />
    }
  >
    <Switch>
      <Route exact path={poolsURLs.pools} render={() => <PoolList />} />
      <Route exact path={poolsURLs.add} render={() => <PoolAdd />} />
      <Route
        exact
        path={poolsURLs.edit(null, true)}
        render={() => <PoolEdit />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  </Section>
);

export default Pools;
