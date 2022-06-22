import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import zonesURLs from "app/zones/urls";
import ZoneDetails from "app/zones/views/ZoneDetails";
import ZonesList from "app/zones/views/ZonesList";

const Zones = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={zonesURLs.index} render={() => <ZonesList />} />
      <Route
        exact
        path={zonesURLs.details(null)}
        render={() => <ZoneDetails />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Zones;
