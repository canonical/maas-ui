import React from "react";
import { Route, Switch } from "react-router-dom";

import Repositories from "app/settings/containers/Repositories";
import Users from "app/users/components/Users";

const Routes = () => (
  <Switch>
    <Route exact path="/settings/users" component={Users} />
    <Route exact path="/settings/scripts" />
    <Route exact path="/settings/storage" />
    <Route exact path="/settings/network" />
    <Route exact path="/settings/dhcp" />
    <Route exact path="/settings/repositories" component={Repositories} />
  </Switch>
);

export default Routes;
