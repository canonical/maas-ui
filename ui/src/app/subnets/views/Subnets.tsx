import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import subnetsURLs from "app/subnets/urls";
import FabricDetails from "app/subnets/views/FabricDetails";
import SpaceDetails from "app/subnets/views/SpaceDetails";
import SubnetDetails from "app/subnets/views/SubnetDetails";
import SubnetsList from "app/subnets/views/SubnetsList";
import VLANDetails from "app/subnets/views/VLANDetails";

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={subnetsURLs.index} render={SubnetsList} />
      <Route
        exact
        path={subnetsURLs.fabric.index(null, true)}
        render={FabricDetails}
      />
      <Route
        exact
        path={subnetsURLs.space.index(null, true)}
        render={SpaceDetails}
      />
      <Route
        exact
        path={subnetsURLs.subnet.index(null, true)}
        render={SubnetDetails}
      />
      <Route
        exact
        path={subnetsURLs.vlan.index(null, true)}
        render={VLANDetails}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Routes;
