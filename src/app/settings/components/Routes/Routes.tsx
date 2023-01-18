import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import Commissioning from "app/settings/views/Configuration/Commissioning";
import Deploy from "app/settings/views/Configuration/Deploy";
import General from "app/settings/views/Configuration/General";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
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
import IpmiSettings from "app/settings/views/Security/IpmiSettings";
import SecretStorage from "app/settings/views/Security/SecretStorage";
import SecurityProtocols from "app/settings/views/Security/SecurityProtocols";
import SessionTimeout from "app/settings/views/Security/SessionTimeout";
import StorageForm from "app/settings/views/Storage/StorageForm";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";
import { getRelativeRoute } from "app/utils";

const Routes = (): JSX.Element => {
  const base = urls.settings.index;
  return (
    <ReactRouterRoutes>
      <Route
        element={<General />}
        path={getRelativeRoute(urls.settings.configuration.general, base)}
      />
      <Route
        element={<Commissioning />}
        path={getRelativeRoute(urls.settings.configuration.commissioning, base)}
      />
      <Route
        element={<KernelParameters />}
        path={getRelativeRoute(
          urls.settings.configuration.kernelParameters,
          base
        )}
      />
      <Route
        element={<Deploy />}
        path={getRelativeRoute(urls.settings.configuration.deploy, base)}
      />
      <Route
        element={<Redirect to={urls.settings.configuration.index} />}
        path="/"
      />
      <Route
        element={<Redirect to={urls.settings.configuration.general} />}
        path={getRelativeRoute(urls.settings.configuration.index, base)}
      />
      <Route
        element={<SecurityProtocols />}
        path={getRelativeRoute(urls.settings.security.securityProtocols, base)}
      />
      <Route
        element={<SecretStorage />}
        path={getRelativeRoute(urls.settings.security.secretStorage, base)}
      />
      <Route
        element={<SessionTimeout />}
        path={getRelativeRoute(urls.settings.security.sessionTimeout, base)}
      />
      <Route
        element={<IpmiSettings />}
        path={getRelativeRoute(urls.settings.security.ipmiSettings, base)}
      />
      <Route
        element={<Redirect to={urls.settings.security.securityProtocols} />}
        path={getRelativeRoute(urls.settings.security.index, base)}
      />
      <Route
        element={<UsersList />}
        path={getRelativeRoute(urls.settings.users.index, base)}
      />
      <Route
        element={<UserAdd />}
        path={getRelativeRoute(urls.settings.users.add, base)}
      />
      <Route
        element={<UserEdit />}
        path={getRelativeRoute(urls.settings.users.edit(null), base)}
      />
      <Route
        element={<LicenseKeyList />}
        path={getRelativeRoute(urls.settings.licenseKeys.index, base)}
      />
      <Route
        element={<LicenseKeyAdd />}
        path={getRelativeRoute(urls.settings.licenseKeys.add, base)}
      />
      <Route
        element={<LicenseKeyEdit />}
        path={getRelativeRoute(urls.settings.licenseKeys.edit(null), base)}
      />
      <Route
        element={<StorageForm />}
        path={getRelativeRoute(urls.settings.storage, base)}
      />
      <Route
        element={<ProxyForm />}
        path={getRelativeRoute(urls.settings.network.proxy, base)}
      />
      <Route
        element={<DnsForm />}
        path={getRelativeRoute(urls.settings.network.dns, base)}
      />
      <Route
        element={<NtpForm />}
        path={getRelativeRoute(urls.settings.network.ntp, base)}
      />
      <Route
        element={<SyslogForm />}
        path={getRelativeRoute(urls.settings.network.syslog, base)}
      />
      <Route
        element={<NetworkDiscoveryForm />}
        path={getRelativeRoute(urls.settings.network.networkDiscovery, base)}
      />
      <Route
        element={<Redirect to={urls.settings.network.proxy} />}
        path={getRelativeRoute(urls.settings.network.index, base)}
      />
      <Route
        element={<ScriptsList type="commissioning" />}
        path={getRelativeRoute(urls.settings.scripts.commissioning.index, base)}
      />
      <Route
        element={<ScriptsUpload type="commissioning" />}
        path={getRelativeRoute(
          urls.settings.scripts.commissioning.upload,
          base
        )}
      />
      <Route
        element={<ScriptsList type="testing" />}
        path={getRelativeRoute(urls.settings.scripts.testing.index, base)}
      />
      <Route
        element={<ScriptsUpload type="testing" />}
        path={getRelativeRoute(urls.settings.scripts.testing.upload, base)}
      />
      <Route
        element={<DhcpList />}
        path={getRelativeRoute(urls.settings.dhcp.index, base)}
      />
      <Route
        element={<DhcpAdd />}
        path={getRelativeRoute(urls.settings.dhcp.add, base)}
      />
      <Route
        element={<DhcpEdit />}
        path={getRelativeRoute(urls.settings.dhcp.edit(null), base)}
      />
      <Route
        element={<RepositoriesList />}
        path={getRelativeRoute(urls.settings.repositories.index, base)}
      />
      <Route
        element={<RepositoryAdd />}
        path={getRelativeRoute(urls.settings.repositories.add(null), base)}
      />
      <Route
        element={<RepositoryEdit />}
        path={getRelativeRoute(urls.settings.repositories.edit(null), base)}
      />
      <Route
        element={<Windows />}
        path={getRelativeRoute(urls.settings.images.windows, base)}
      />
      <Route
        element={<VMWare />}
        path={getRelativeRoute(urls.settings.images.vmware, base)}
      />
      <Route
        element={<ThirdPartyDrivers />}
        path={getRelativeRoute(urls.settings.images.ubuntu, base)}
      />
      <Route element={<NotFound />} path="*" />
    </ReactRouterRoutes>
  );
};

export default Routes;
