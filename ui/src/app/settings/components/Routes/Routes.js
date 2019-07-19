import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

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
    <Redirect from="/" to="/users" />
  </Switch>
);

export default Routes;
