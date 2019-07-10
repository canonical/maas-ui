import React, { Fragment } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import General from "app/general/containers/General";
import Repositories from "app/settings/containers/Repositories";
import Users from "app/users/components/Users";

const Routes = () => (
  <Fragment>
    <Switch>
      <Route exact path="/general" component={General} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/scripts" />
      <Route exact path="/storage" />
      <Route exact path="/network" />
      <Route exact path="/dhcp" />
      <Route exact path="/repositories" component={Repositories} />
      <Redirect from="/" to="general" />
    </Switch>
  </Fragment>
);

export default Routes;
