import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Commissioning from "app/settings/views/Configuration/Commissioning";
import Deploy from "app/settings/views/Configuration/Deploy";
import DhcpList from "app/settings/views/Dhcp/DhcpList";
import DnsForm from "app/settings/views/Network/DnsForm";
import General from "app/settings/views/Configuration/General";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "app/settings/views/Network/NtpForm";
import ProxyForm from "app/settings/views/Network/ProxyForm";
import RepositoriesList from "app/settings/views/Repositories/RepositoriesList";
import RepositoryAdd from "app/settings/views/Repositories/RepositoryAdd";
import RepositoryEdit from "app/settings/views/Repositories/RepositoryEdit";
import Scripts from "app/settings/views/Scripts/Scripts";
import ScriptsUpload from "app/settings/views/Scripts/ScriptsUpload";
import StorageForm from "app/settings/views/Storage/StorageForm";
import SyslogForm from "app/settings/views/Network/SyslogForm";
import ThirdPartyDrivers from "app/settings/views/Images/ThirdPartyDrivers";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";
import VMWare from "app/settings/views/Images/VMWare";
import Windows from "app/settings/views/Images/Windows";

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
    <Route exact path="/configuration/deploy" component={Deploy} />
    <Redirect exact from="/" to="/configuration" />
    <Redirect from="/configuration" to="/configuration/general" />
    <Route exact path="/users" component={UsersList} />
    <Route exact path="/users/add" component={UserAdd} />
    <Route exact path="/users/:id/edit" component={UserEdit} />
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
    <Route
      exact
      path="/scripts/commissioning"
      render={props => <Scripts {...props} type="commissioning" />}
    />
    <Route
      exact
      path="/scripts/commissioning/upload"
      render={props => <ScriptsUpload {...props} type="commissioning" />}
    />
    <Route
      exact
      path="/scripts/testing"
      render={props => <Scripts {...props} type="testing" />}
    />
    <Route
      exact
      path="/scripts/testing/upload"
      render={props => <ScriptsUpload {...props} type="testing" />}
    />
    <Route exact path="/dhcp" component={DhcpList} />
    <Route exact path="/repositories" component={RepositoriesList} />
    <Route exact path="/repositories/add/:type" component={RepositoryAdd} />
    <Route
      exact
      path="/repositories/edit/:type/:id"
      component={RepositoryEdit}
    />
    <Route exact path="/images/windows" component={Windows} />
    <Route exact path="/images/vmware" component={VMWare} />
    <Route exact path="/images/ubuntu" component={ThirdPartyDrivers} />
  </Switch>
);

export default Routes;
