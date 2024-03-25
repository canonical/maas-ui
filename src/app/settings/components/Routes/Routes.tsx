import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

import PageContent from "@/app/base/components/PageContent";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import Commissioning from "@/app/settings/views/Configuration/Commissioning";
import Deploy from "@/app/settings/views/Configuration/Deploy";
import General from "@/app/settings/views/Configuration/General";
import KernelParameters from "@/app/settings/views/Configuration/KernelParameters";
import DhcpAdd from "@/app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "@/app/settings/views/Dhcp/DhcpEdit";
import DhcpList from "@/app/settings/views/Dhcp/DhcpList";
import ThirdPartyDrivers from "@/app/settings/views/Images/ThirdPartyDrivers";
import VMWare from "@/app/settings/views/Images/VMWare";
import Windows from "@/app/settings/views/Images/Windows";
import LicenseKeyAdd from "@/app/settings/views/LicenseKeys/LicenseKeyAdd";
import LicenseKeyEdit from "@/app/settings/views/LicenseKeys/LicenseKeyEdit";
import LicenseKeyList from "@/app/settings/views/LicenseKeys/LicenseKeyList";
import DnsForm from "@/app/settings/views/Network/DnsForm";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "@/app/settings/views/Network/NtpForm";
import ProxyForm from "@/app/settings/views/Network/ProxyForm";
import SyslogForm from "@/app/settings/views/Network/SyslogForm";
import RepositoriesList from "@/app/settings/views/Repositories/RepositoriesList";
import RepositoryAdd from "@/app/settings/views/Repositories/RepositoryAdd";
import RepositoryEdit from "@/app/settings/views/Repositories/RepositoryEdit";
import ScriptsList from "@/app/settings/views/Scripts/ScriptsList";
import ScriptsUpload from "@/app/settings/views/Scripts/ScriptsUpload";
import IpmiSettings from "@/app/settings/views/Security/IpmiSettings";
import SecretStorage from "@/app/settings/views/Security/SecretStorage";
import SecurityProtocols from "@/app/settings/views/Security/SecurityProtocols";
import SessionTimeout from "@/app/settings/views/Security/SessionTimeout";
import StorageForm from "@/app/settings/views/Storage/StorageForm";
import UserAdd from "@/app/settings/views/Users/UserAdd";
import UserDelete from "@/app/settings/views/Users/UserDelete";
import UserEdit from "@/app/settings/views/Users/UserEdit";
import UsersList from "@/app/settings/views/Users/UsersList";
import { getRelativeRoute } from "@/app/utils";

const Routes = (): JSX.Element => {
  const base = urls.settings.index;
  return (
    <ReactRouterRoutes>
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <General />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.configuration.general, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <Commissioning />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.configuration.commissioning, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <KernelParameters />
          </PageContent>
        }
        path={getRelativeRoute(
          urls.settings.configuration.kernelParameters,
          base
        )}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <Deploy />
          </PageContent>
        }
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
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SecurityProtocols />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.security.securityProtocols, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SecretStorage />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.security.secretStorage, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SessionTimeout />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.security.sessionTimeout, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <IpmiSettings />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.security.ipmiSettings, base)}
      />
      <Route
        element={<Redirect to={urls.settings.security.securityProtocols} />}
        path={getRelativeRoute(urls.settings.security.index, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle="">
            <UsersList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.users.index, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={<UserAdd />} sidePanelTitle="Add User">
            <UsersList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.users.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<UserEdit />}
            sidePanelTitle="Edit User"
          >
            <UsersList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.users.edit(null), base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<UserDelete />}
            sidePanelTitle="Delete User"
          >
            <UsersList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.users.delete(null), base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <LicenseKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.licenseKeys.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<LicenseKeyAdd />}
            sidePanelTitle="Add license key"
          >
            <LicenseKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.licenseKeys.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<LicenseKeyEdit />}
            sidePanelTitle="Update license key"
          >
            <LicenseKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.licenseKeys.edit(null), base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <StorageForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.storage, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <ProxyForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.network.proxy, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <DnsForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.network.dns, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <NtpForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.network.ntp, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SyslogForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.network.syslog, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <NetworkDiscoveryForm />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.network.networkDiscovery, base)}
      />
      <Route
        element={<Redirect to={urls.settings.network.proxy} />}
        path={getRelativeRoute(urls.settings.network.index, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <ScriptsList type="commissioning" />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.scripts.commissioning.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<ScriptsUpload type="commissioning" />}
            sidePanelTitle="Upload commissioning script"
          >
            <ScriptsList type="commissioning" />
          </PageContent>
        }
        path={getRelativeRoute(
          urls.settings.scripts.commissioning.upload,
          base
        )}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <ScriptsList type="testing" />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.scripts.testing.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<ScriptsUpload type="testing" />}
            sidePanelTitle="Upload testing script"
          >
            <ScriptsList type="testing" />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.scripts.testing.upload, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <DhcpList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.dhcp.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<DhcpAdd />}
            sidePanelTitle="Add DHCP snippet"
          >
            <DhcpList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.dhcp.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<DhcpEdit />}
            sidePanelTitle="Edit DHCP snippet"
          >
            <DhcpList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.dhcp.edit(null), base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <RepositoriesList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.repositories.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<RepositoryAdd />}
            sidePanelTitle="Add Repository"
          >
            <RepositoriesList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.repositories.add(null), base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<RepositoryEdit />}
            sidePanelTitle={"Edit Repository"}
          >
            <RepositoriesList />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.repositories.edit(null), base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <Windows />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.images.windows, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <VMWare />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.images.vmware, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <ThirdPartyDrivers />
          </PageContent>
        }
        path={getRelativeRoute(urls.settings.images.ubuntu, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <NotFound />
          </PageContent>
        }
        path="*"
      />
    </ReactRouterRoutes>
  );
};

export default Routes;
