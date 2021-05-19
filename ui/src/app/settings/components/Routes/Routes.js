import { Route, Redirect, Switch } from "react-router-dom";

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
import settingsURLs from "app/settings/urls";
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
  return (
    <Switch>
      <Route
        exact
        path={settingsURLs.configuration.general}
        component={General}
      />
      <Route
        exact
        path={settingsURLs.configuration.commissioning}
        component={Commissioning}
      />
      <Route
        exact
        path={settingsURLs.configuration.kernelParameters}
        component={KernelParameters}
      />
      <Route
        exact
        path={settingsURLs.configuration.deploy}
        component={Deploy}
      />
      <Redirect
        exact
        from={settingsURLs.index}
        to={settingsURLs.configuration.index}
      />
      <Redirect
        from={settingsURLs.configuration.index}
        to={settingsURLs.configuration.general}
      />
      <Route exact path={settingsURLs.users.index} component={UsersList} />
      <Route exact path={settingsURLs.users.add} component={UserAdd} />
      <Route
        exact
        path={settingsURLs.users.edit(null, true)}
        component={UserEdit}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.index}
        component={LicenseKeyList}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.add}
        component={LicenseKeyAdd}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.edit(null, true)}
        component={LicenseKeyEdit}
      />
      <Route exact path={settingsURLs.storage} component={StorageForm} />
      <Route exact path={settingsURLs.network.proxy} component={ProxyForm} />
      <Route exact path={settingsURLs.network.dns} component={DnsForm} />
      <Route exact path={settingsURLs.network.ntp} component={NtpForm} />
      <Route exact path={settingsURLs.network.syslog} component={SyslogForm} />
      <Route
        exact
        path={settingsURLs.network.networkDiscovery}
        component={NetworkDiscoveryForm}
      />
      <Redirect
        exact
        from={settingsURLs.network.index}
        to={settingsURLs.network.proxy}
      />
      <Route
        exact
        path={settingsURLs.scripts.commissioning.index}
        render={(props) => <ScriptsList {...props} type="commissioning" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.commissioning.upload}
        render={(props) => <ScriptsUpload {...props} type="commissioning" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.testing.index}
        render={(props) => <ScriptsList {...props} type="testing" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.testing.upload}
        render={(props) => <ScriptsUpload {...props} type="testing" />}
      />
      <Route exact path={settingsURLs.dhcp.index} component={DhcpList} />
      <Route exact path={settingsURLs.dhcp.add} component={DhcpAdd} />
      <Route
        exact
        path={settingsURLs.dhcp.edit(null, true)}
        component={DhcpEdit}
      />
      <Route
        exact
        path={settingsURLs.repositories.index}
        component={RepositoriesList}
      />
      <Route
        exact
        path={settingsURLs.repositories.add(null, true)}
        component={RepositoryAdd}
      />
      <Route
        exact
        path={settingsURLs.repositories.edit(null, true)}
        component={RepositoryEdit}
      />
      <Route exact path={settingsURLs.images.windows} component={Windows} />
      <Route exact path={settingsURLs.images.vmware} component={VMWare} />
      <Route
        exact
        path={settingsURLs.images.ubuntu}
        component={ThirdPartyDrivers}
      />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
