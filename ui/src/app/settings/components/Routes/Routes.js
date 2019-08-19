import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Commissioning from "app/settings/views/Configuration/Commissioning";
import Dhcp from "app/settings/views/Dhcp";
import DnsForm from "app/settings/views/Network/DnsForm";
import General from "app/settings/views/Configuration/General";
import Images from "app/settings/views/Images";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "app/settings/views/Network/NtpForm";
import ProxyForm from "app/settings/views/Network/ProxyForm";
import Repositories from "app/settings/views/Repositories";
import Scripts from "app/settings/views/Scripts";
import StorageForm from "app/settings/views/Storage/StorageForm";
import SyslogForm from "app/settings/views/Network/SyslogForm";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";

const Routes = () => (
  <Switch>
    <Route exact path="/configuration/general" component={General} />
    <Route
      exact
      path="/configuration/commissioning"
      component={Commissioning}
    />
    <Route
      exact
      path="/configuration/kernel-parameters"
      component={KernelParameters}
    />
    <Redirect from="/configuration" to="/configuration/general" />
    <Route exact path="/users" component={UsersList} />
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
  </Switch>
);

export default Routes;
