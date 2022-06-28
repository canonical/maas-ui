import { Route, Redirect, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import settingsURLs from "app/settings/urls";
import Commissioning from "app/settings/views/Configuration/Commissioning";
import Deploy from "app/settings/views/Configuration/Deploy";
import General from "app/settings/views/Configuration/General";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
import Security from "app/settings/views/Configuration/Security";
import DhcpAdd from "app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "app/settings/views/Dhcp/DhcpEdit";
import DhcpList from "app/settings/views/Dhcp/DhcpList";
import ThirdPartyDrivers from "app/settings/views/Images/ThirdPartyDrivers";
import VMWare from "app/settings/views/Images/VMWare";
import Windows from "app/settings/views/Images/Windows";
import LicenseKeyAdd from "app/settings/views/LicenseKeys/LicenseKeyAdd";
import LicenseKeyEdit from "app/settings/views/LicenseKeys/LicenseKeyEdit";
import LicenseKeyList from "app/settings/views/LicenseKeys/LicenseKeyList";
import DnsForm from "app/settings/views/Network/DnsForm";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "app/settings/views/Network/NtpForm";
import ProxyForm from "app/settings/views/Network/ProxyForm";
import SyslogForm from "app/settings/views/Network/SyslogForm";
import RepositoriesList from "app/settings/views/Repositories/RepositoriesList";
import RepositoryAdd from "app/settings/views/Repositories/RepositoryAdd";
import RepositoryEdit from "app/settings/views/Repositories/RepositoryEdit";
import ScriptsList from "app/settings/views/Scripts/ScriptsList";
import ScriptsUpload from "app/settings/views/Scripts/ScriptsUpload";
import StorageForm from "app/settings/views/Storage/StorageForm";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Route
        exact
        path={settingsURLs.configuration.general}
        render={() => <General />}
      />
      <Route
        exact
        path={settingsURLs.configuration.security}
        render={() => <Security />}
      />
      <Route
        exact
        path={settingsURLs.configuration.commissioning}
        render={() => <Commissioning />}
      />
      <Route
        exact
        path={settingsURLs.configuration.kernelParameters}
        render={() => <KernelParameters />}
      />
      <Route
        exact
        path={settingsURLs.configuration.deploy}
        render={() => <Deploy />}
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
      <Route
        exact
        path={settingsURLs.users.index}
        render={() => <UsersList />}
      />
      <Route exact path={settingsURLs.users.add} render={() => <UserAdd />} />
      <Route
        exact
        path={settingsURLs.users.edit(null)}
        render={() => <UserEdit />}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.index}
        render={() => <LicenseKeyList />}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.add}
        render={() => <LicenseKeyAdd />}
      />
      <Route
        exact
        path={settingsURLs.licenseKeys.edit(null)}
        render={() => <LicenseKeyEdit />}
      />
      <Route exact path={settingsURLs.storage} render={() => <StorageForm />} />
      <Route
        exact
        path={settingsURLs.network.proxy}
        render={() => <ProxyForm />}
      />
      <Route exact path={settingsURLs.network.dns} render={() => <DnsForm />} />
      <Route exact path={settingsURLs.network.ntp} render={() => <NtpForm />} />
      <Route
        exact
        path={settingsURLs.network.syslog}
        render={() => <SyslogForm />}
      />
      <Route
        exact
        path={settingsURLs.network.networkDiscovery}
        render={() => <NetworkDiscoveryForm />}
      />
      <Redirect
        exact
        from={settingsURLs.network.index}
        to={settingsURLs.network.proxy}
      />
      <Route
        exact
        path={settingsURLs.scripts.commissioning.index}
        render={() => <ScriptsList type="commissioning" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.commissioning.upload}
        render={() => <ScriptsUpload type="commissioning" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.testing.index}
        render={() => <ScriptsList type="testing" />}
      />
      <Route
        exact
        path={settingsURLs.scripts.testing.upload}
        render={() => <ScriptsUpload type="testing" />}
      />
      <Route exact path={settingsURLs.dhcp.index} render={() => <DhcpList />} />
      <Route exact path={settingsURLs.dhcp.add} render={() => <DhcpAdd />} />
      <Route
        exact
        path={settingsURLs.dhcp.edit(null)}
        render={() => <DhcpEdit />}
      />
      <Route
        exact
        path={settingsURLs.repositories.index}
        render={() => <RepositoriesList />}
      />
      <Route
        exact
        path={settingsURLs.repositories.add(null)}
        render={() => <RepositoryAdd />}
      />
      <Route
        exact
        path={settingsURLs.repositories.edit(null)}
        render={() => <RepositoryEdit />}
      />
      <Route
        exact
        path={settingsURLs.images.windows}
        render={() => <Windows />}
      />
      <Route
        exact
        path={settingsURLs.images.vmware}
        render={() => <VMWare />}
      />
      <Route
        exact
        path={settingsURLs.images.ubuntu}
        render={() => <ThirdPartyDrivers />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Routes;
