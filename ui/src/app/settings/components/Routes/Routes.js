import React from "react";
import { Route, Switch } from "react-router-dom";

import Repositories from "app/settings/containers/Repositories";
import Users from "app/users/components/Users";

const Routes = () => (
  <Switch>
    <Route exact path="/users" component={Users} />
    <Route exact path="/scripts" />
    <Route exact path="/storage" />
    <Route exact path="/network" />
    <Route exact path="/dhcp" />
    <Route exact path="/repositories" component={Repositories} />
  </Switch>
);

export default Routes;
