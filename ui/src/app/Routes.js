import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import General from "app/general/containers/General";
import Settings from "app/settings/containers/Settings";

const Routes = () => (
  <Switch>
    <Route exact path="/general" component={General} />
    <Route path="/settings" component={Settings} />
    <Redirect from="/" to="general" />
  </Switch>
);

export default Routes;
