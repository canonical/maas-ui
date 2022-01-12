import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import subnetsURLs from "app/subnets/urls";
import SubnetsList from "app/subnets/views/SubnetsList";

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={subnetsURLs.index} component={SubnetsList} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
