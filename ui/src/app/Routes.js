import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Machines from "app/machines/views/Machines";
import Settings from "app/settings/views/Settings";

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/machines" />
    <Route path="/settings" component={Settings} />
    <Route path="/machines" component={Machines} />
  </Switch>
);

export default Routes;
