import { Route, Switch } from "react-router-dom";

import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import ZoneDetails from "app/zones/views/ZoneDetails";
import ZonesList from "app/zones/views/ZonesList";

const Zones = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={urls.zones.index} render={() => <ZonesList />} />
      <Route
        exact
        path={urls.zones.details(null)}
        render={() => <ZoneDetails />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Zones;
