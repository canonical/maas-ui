import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Configuration from "app/settings/containers/Configuration";
import Dhcp from "app/settings/containers/Dhcp";
import Images from "app/settings/containers/Images";
import Network from "app/settings/containers/Network";
import Repositories from "app/settings/containers/Repositories";
import Scripts from "app/settings/containers/Scripts";
import Storage from "app/settings/containers/Storage";
import UserAdd from "app/settings/containers/UserAdd";
import UserEdit from "app/settings/containers/UserEdit";
import Users from "app/settings/containers/Users";

const Routes = () => (
  <Switch>
    <Route exact path="/configuration" component={Configuration} />
    <Route exact path="/users" component={Users} />
    <Route exact path="/users/add" component={UserAdd} />
    <Route exact path="/users/:id/edit" component={UserEdit} />
    <Route exact path="/images" component={Images} />
    <Route exact path="/storage" component={Storage} />
    <Route exact path="/network" component={Network} />
    <Route exact path="/scripts" component={Scripts} />
    <Route exact path="/dhcp" component={Dhcp} />
    <Route exact path="/repositories" component={Repositories} />
    <Redirect from="/" to="/configuration" />
  </Switch>
);

export default Routes;
