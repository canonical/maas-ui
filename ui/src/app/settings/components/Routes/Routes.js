import { Route, Redirect, Switch, useRouteMatch } from "react-router-dom";

import Commissioning from "app/settings/views/Configuration/Commissioning";
import Deploy from "app/settings/views/Configuration/Deploy";
import DhcpAdd from "app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "app/settings/views/Dhcp/DhcpEdit";
import DhcpList from "app/settings/views/Dhcp/DhcpList";
import DnsForm from "app/settings/views/Network/DnsForm";
import General from "app/settings/views/Configuration/General";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
import LicenseKeyList from "app/settings/views/LicenseKeys/LicenseKeyList";
import LicenseKeyAdd from "app/settings/views/LicenseKeys/LicenseKeyAdd";
import LicenseKeyEdit from "app/settings/views/LicenseKeys/LicenseKeyEdit";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import NotFound from "app/base/views/NotFound";
import NtpForm from "app/settings/views/Network/NtpForm";
import ProxyForm from "app/settings/views/Network/ProxyForm";
import RepositoriesList from "app/settings/views/Repositories/RepositoriesList";
import RepositoryAdd from "app/settings/views/Repositories/RepositoryAdd";
import RepositoryEdit from "app/settings/views/Repositories/RepositoryEdit";
import ScriptsList from "app/settings/views/Scripts/ScriptsList";
import ScriptsUpload from "app/settings/views/Scripts/ScriptsUpload";
import StorageForm from "app/settings/views/Storage/StorageForm";
import SyslogForm from "app/settings/views/Network/SyslogForm";
import ThirdPartyDrivers from "app/settings/views/Images/ThirdPartyDrivers";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";
import VMWare from "app/settings/views/Images/VMWare";
import Windows from "app/settings/views/Images/Windows";

const Routes = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/configuration/general`}
        component={General}
      />
      <Route
        exact
        path={`${match.path}/configuration/commissioning`}
        component={Commissioning}
      />
      <Route
        exact
        path={`${match.path}/configuration/kernel-parameters`}
        component={KernelParameters}
      />
      <Route
        exact
        path={`${match.path}/configuration/deploy`}
        component={Deploy}
      />
      <Redirect
        exact
        from={`${match.path}/`}
        to={`${match.path}/configuration`}
      />
      <Redirect
        from={`${match.path}/configuration`}
        to={`${match.path}/configuration/general`}
      />
      <Route exact path={`${match.path}/users`} component={UsersList} />
      <Route exact path={`${match.path}/users/add`} component={UserAdd} />
      <Route exact path={`${match.path}/users/:id/edit`} component={UserEdit} />
      <Route
        exact
        path={`${match.path}/license-keys`}
        component={LicenseKeyList}
      />
      <Route
        exact
        path={`${match.path}/license-keys/add`}
        component={LicenseKeyAdd}
      />
      <Route
        exact
        path={`${match.path}/license-keys/:osystem/:distro_series/edit`}
        component={LicenseKeyEdit}
      />
      <Route exact path={`${match.path}/storage`} component={StorageForm} />
      <Route exact path={`${match.path}/network/proxy`} component={ProxyForm} />
      <Route exact path={`${match.path}/network/dns`} component={DnsForm} />
      <Route exact path={`${match.path}/network/ntp`} component={NtpForm} />
      <Route
        exact
        path={`${match.path}/network/syslog`}
        component={SyslogForm}
      />
      <Route
        exact
        path={`${match.path}/network/network-discovery`}
        component={NetworkDiscoveryForm}
      />
      <Redirect
        exact
        from={`${match.path}/network`}
        to={`${match.path}/network/proxy`}
      />
      <Route
        exact
        path={`${match.path}/scripts/commissioning`}
        render={(props) => <ScriptsList {...props} type="commissioning" />}
      />
      <Route
        exact
        path={`${match.path}/scripts/commissioning/upload`}
        render={(props) => <ScriptsUpload {...props} type="commissioning" />}
      />
      <Route
        exact
        path={`${match.path}/scripts/testing`}
        render={(props) => <ScriptsList {...props} type="testing" />}
      />
      <Route
        exact
        path={`${match.path}/scripts/testing/upload`}
        render={(props) => <ScriptsUpload {...props} type="testing" />}
      />
      <Route exact path={`${match.path}/dhcp`} component={DhcpList} />
      <Route exact path={`${match.path}/dhcp/add`} component={DhcpAdd} />
      <Route exact path={`${match.path}/dhcp/:id/edit`} component={DhcpEdit} />
      <Route
        exact
        path={`${match.path}/repositories`}
        component={RepositoriesList}
      />
      <Route
        exact
        path={`${match.path}/repositories/add/:type`}
        component={RepositoryAdd}
      />
      <Route
        exact
        path={`${match.path}/repositories/edit/:type/:id`}
        component={RepositoryEdit}
      />
      <Route exact path={`${match.path}/images/windows`} component={Windows} />
      <Route exact path={`${match.path}/images/vmware`} component={VMWare} />
      <Route
        exact
        path={`${match.path}/images/ubuntu`}
        component={ThirdPartyDrivers}
      />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
