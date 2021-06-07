import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import zonesURLs from "app/zones/urls";
import ZonesList from "app/zones/views/ZonesList";

const Zones = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[zonesURLs.index]}>
        <ZonesList />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Zones;
