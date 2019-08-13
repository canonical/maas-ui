import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Configuration from "app/settings/containers/Configuration";
import Dhcp from "app/settings/containers/Dhcp";
import DnsForm from "app/settings/containers/Network/DnsForm";
import Images from "app/settings/containers/Images";
import NetworkDiscoveryForm from "app/settings/containers/Network/NetworkDiscoveryForm";
import NtpForm from "app/settings/containers/Network/NtpForm";
import ProxyForm from "app/settings/containers/Network/ProxyForm";
import Repositories from "app/settings/containers/Repositories";
import Scripts from "app/settings/containers/Scripts";
import StorageForm from "app/settings/containers/Storage/StorageForm";
import SyslogForm from "app/settings/containers/Network/SyslogForm";
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
    <Route exact path="/storage" component={StorageForm} />
    <Route exact path="/network/proxy" component={ProxyForm} />
    <Route exact path="/network/dns" component={DnsForm} />
    <Route exact path="/network/ntp" component={NtpForm} />
    <Route exact path="/network/syslog" component={SyslogForm} />
    <Route
      exact
      path="/network/network-discovery"
      component={NetworkDiscoveryForm}
    />
    <Redirect from="/network" to="/network/proxy" />
    <Route exact path="/scripts" component={Scripts} />
    <Route exact path="/dhcp" component={Dhcp} />
    <Route exact path="/repositories" component={Repositories} />
    <Redirect from="/" to="/configuration" />
  </Switch>
);

export default Routes;
