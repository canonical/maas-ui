import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import { useRouter } from "app/base/hooks";
import Details from "app/preferences/views/Details";

const Routes = () => {
  const { match } = useRouter();
  return (
    <Switch>
      <Redirect exact from={`${match.path}/`} to={`${match.path}/details`} />
      <Route exact path={`${match.path}/details`} component={Details} />
    </Switch>
  );
};

export default Routes;
