import { lazy } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { createBrowserRouter, Navigate } from "react-router";

import TagDetails from "./app/tags/views/TagDetails";
import TagList from "./app/tags/views/TagList";

import App from "@/app/App";
import ErrorBoundary from "@/app/base/components/ErrorBoundary";
import PageContent from "@/app/base/components/PageContent";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import APIKeyList from "@/app/preferences/views/APIKeys/views";
import Details from "@/app/preferences/views/Details";
import SSHKeysList from "@/app/preferences/views/SSHKeys/views";
import SSLKeysList from "@/app/preferences/views/SSLKeys/views";
import Commissioning from "@/app/settings/views/Configuration/Commissioning";
import Deploy from "@/app/settings/views/Configuration/Deploy";
import General from "@/app/settings/views/Configuration/General";
import KernelParameters from "@/app/settings/views/Configuration/KernelParameters";
import DhcpAdd from "@/app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "@/app/settings/views/Dhcp/DhcpEdit";
import DhcpList from "@/app/settings/views/Dhcp/DhcpList";
import ChangeSource from "@/app/settings/views/Images/ChangeSource";
import ThirdPartyDrivers from "@/app/settings/views/Images/ThirdPartyDrivers";
import VMWare from "@/app/settings/views/Images/VMWare";
import Windows from "@/app/settings/views/Images/Windows";
import LicenseKeyList from "@/app/settings/views/LicenseKeys/views";
import DnsForm from "@/app/settings/views/Network/DnsForm";
import NetworkDiscoveryForm from "@/app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "@/app/settings/views/Network/NtpForm";
import ProxyForm from "@/app/settings/views/Network/ProxyForm";
import SyslogForm from "@/app/settings/views/Network/SyslogForm";
import RepositoriesList from "@/app/settings/views/Repositories/views";
import ScriptsList from "@/app/settings/views/Scripts/ScriptsList";
import ScriptsUpload from "@/app/settings/views/Scripts/ScriptsUpload";
import IpmiSettings from "@/app/settings/views/Security/IpmiSettings";
import SecretStorage from "@/app/settings/views/Security/SecretStorage";
import SecurityProtocols from "@/app/settings/views/Security/SecurityProtocols";
import SessionTimeout from "@/app/settings/views/Security/SessionTimeout";
import StorageForm from "@/app/settings/views/Storage/StorageForm";
import SingleSignOn from "@/app/settings/views/UserManagement/views/SingleSignOn";
import UsersList from "@/app/settings/views/UserManagement/views/UsersList/UsersList";
import { getRelativeRoute } from "@/app/utils";

const ControllerDetails = lazy(
  () => import("@/app/controllers/views/ControllerDetails")
);
const ControllerList = lazy(
  () => import("@/app/controllers/views/ControllerList")
);
const DeviceDetails = lazy(() => import("@/app/devices/views/DeviceDetails"));
const DeviceList = lazy(() => import("@/app/devices/views/DeviceList"));
const DomainDetails = lazy(() => import("@/app/domains/views/DomainDetails"));
const DomainsList = lazy(() => import("@/app/domains/views/DomainsList"));
const ImageList = lazy(() => import("@/app/images/views/ImageList"));
const Intro = lazy(() => import("@/app/intro/views/Intro"));
const KVM = lazy(() => import("@/app/kvm/views/KVM"));
const MachineDetails = lazy(
  () => import("@/app/machines/views/MachineDetails")
);
const Machines = lazy(() => import("@/app/machines/views/Machines"));
const DiscoveriesList = lazy(
  () => import("@/app/networkDiscovery/views/DiscoveriesList")
);
const NetworkDiscoveryConfigurationForm = lazy(
  () => import("@/app/networkDiscovery/views/NetworkDiscoveryConfigurationForm")
);
const Networks = lazy(() => import("@/app/networks"));
const PoolsList = lazy(() => import("@/app/pools/views/PoolsList"));
const RacksList = lazy(() => import("@/app/racks/views/RacksList"));
const Settings = lazy(() => import("@/app/settings/views/Settings"));
const FabricDetails = lazy(
  () => import("@/app/networks/views/Fabrics/views/FabricDetails")
);
const SpaceDetails = lazy(
  () => import("@/app/networks/views/Spaces/views/SpaceDetails")
);
const SubnetDetails = lazy(
  () => import("@/app/networks/views/Subnets/views/SubnetDetails")
);
const SubnetsList = lazy(
  () => import("@/app/networks/views/Subnets/views/SubnetsList")
);
const VLANDetails = lazy(
  () => import("@/app/networks/views/VLANs/views/VLANDetails")
);
const ZonesList = lazy(() => import("@/app/zones/views"));

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: urls.index,
          element: <Navigate replace to={urls.machines.index} />,
        },
        {
          path: urls.machines.index,
          element: (
            <ErrorBoundary>
              <Machines />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.zones.index}`,
          element: (
            <ErrorBoundary>
              <ZonesList />
            </ErrorBoundary>
          ),
        },
        {
          path: urls.networkDiscovery.index,
          children: [
            {
              path: urls.networkDiscovery.index,
              element: (
                <ErrorBoundary>
                  <DiscoveriesList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.networkDiscovery.configuration,
                urls.networkDiscovery.index
              ),
              element: (
                <ErrorBoundary>
                  <NetworkDiscoveryConfigurationForm />
                </ErrorBoundary>
              ),
            },
          ],
        },
        {
          path: urls.networkDiscovery.legacyIndex,
          element: <Navigate replace to={urls.networkDiscovery.index} />,
        },
        {
          path: urls.networkDiscovery.legacyConfiguration,
          element: (
            <Navigate replace to={urls.networkDiscovery.configuration} />
          ),
        },
        {
          path: `${urls.devices.index}/*`,
          element: (
            <ErrorBoundary>
              <DeviceList />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.devices.device.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <DeviceDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.domains.index}/*`,
          element: (
            <ErrorBoundary>
              <DomainsList />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.domains.details(null)}/*`,
          element: (
            <ErrorBoundary>
              <DomainDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.tags.index}/*`,
          element: (
            <ErrorBoundary>
              <TagList />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.tags.tag.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <TagDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.networks.space.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <SpaceDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.settings.index}/*`,
          element: (
            <ErrorBoundary>
              <Settings />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.intro.index}/*`,
          element: (
            <ErrorBoundary>
              <Intro />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.images.index}/*`,
          element: (
            <ErrorBoundary>
              <ImageList />
            </ErrorBoundary>
          ),
        },
        {
          path: urls.preferences.index,
          children: [
            {
              path: urls.preferences.index,
              element: <Navigate replace to={urls.preferences.details} />,
            },
            {
              path: getRelativeRoute(
                urls.preferences.details,
                urls.preferences.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    aria-label={"My preferences"}
                    sidePanelContent={null}
                    sidePanelTitle={null}
                  >
                    <Details />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.preferences.apiKeys.index,
                urls.preferences.index
              ),
              element: (
                <ErrorBoundary>
                  <APIKeyList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.preferences.sshKeys,
                urls.preferences.index
              ),
              element: (
                <ErrorBoundary>
                  <SSHKeysList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.preferences.sslKeys,
                urls.preferences.index
              ),
              element: (
                <ErrorBoundary>
                  <SSLKeysList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute("*", urls.preferences.index),
              element: <NotFound />,
            },
          ],
        },
        {
          path: `${urls.machines.machine.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <MachineDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.networks.fabric.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <FabricDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.controllers.controller.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <ControllerDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.controllers.index}/*`,
          element: (
            <ErrorBoundary>
              <ControllerList />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.kvm.index}/*`,
          element: (
            <ErrorBoundary>
              <KVM />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.pools.index}/*`,
          element: (
            <ErrorBoundary>
              <PoolsList />
            </ErrorBoundary>
          ),
        },
        {
          path: urls.networks.index,
          element: <Networks />,
          children: [
            {
              path: `${urls.networks.index}`,
              element: <Navigate replace to={urls.networks.subnets.index} />,
            },
            {
              path: getRelativeRoute(
                urls.networks.subnets.index,
                urls.networks.index
              ),
              element: (
                <ErrorBoundary>
                  <SubnetsList />
                </ErrorBoundary>
              ),
            },
          ],
        },
        {
          path: `${urls.networks.subnet.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <SubnetDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.networks.vlan.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <VLANDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.racks.index}/*`,
          element: (
            <ErrorBoundary>
              <RacksList />
            </ErrorBoundary>
          ),
        },
        {
          path: urls.settings.index,
          element: <Settings />,
          children: [
            {
              path: urls.settings.index,
              element: (
                <Navigate replace to={urls.settings.configuration.index} />
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.configuration.index,
                urls.settings.index
              ),
              element: (
                <Navigate replace to={urls.settings.configuration.general} />
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.security.index,
                urls.settings.index
              ),
              element: (
                <Navigate
                  replace
                  to={urls.settings.security.securityProtocols}
                />
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.index,
                urls.settings.index
              ),
              element: <Navigate replace to={urls.settings.network.proxy} />,
            },
            {
              path: getRelativeRoute(
                urls.settings.configuration.general,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <General />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.configuration.commissioning,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <Commissioning />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.configuration.kernelParameters,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <KernelParameters />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.configuration.deploy,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <Deploy />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.security.securityProtocols,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <SecurityProtocols />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.security.secretStorage,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <SecretStorage />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.security.sessionTimeout,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <SessionTimeout />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.security.ipmiSettings,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <IpmiSettings />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.userManagement.users,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <UsersList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.userManagement.singleSignOn,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <SingleSignOn />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.licenseKeys.index,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <LicenseKeyList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.storage,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <StorageForm />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.proxy,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <ProxyForm />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.dns,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <DnsForm />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.ntp,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <NtpForm />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.syslog,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <SyslogForm />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.network.networkDiscovery,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    header={
                      <MainToolbar>
                        <MainToolbar.Title>Network discovery</MainToolbar.Title>
                      </MainToolbar>
                    }
                    sidePanelContent={null}
                    sidePanelTitle={null}
                  >
                    <NetworkDiscoveryForm />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.scripts.commissioning.index,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent sidePanelContent={null} sidePanelTitle={null}>
                    <ScriptsList type="commissioning" />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.scripts.commissioning.upload,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<ScriptsUpload type="commissioning" />}
                    sidePanelTitle="Upload commissioning script"
                  >
                    <ScriptsList type="commissioning" />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.scripts.testing.index,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent sidePanelContent={null} sidePanelTitle={null}>
                    <ScriptsList type="testing" />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.scripts.testing.upload,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<ScriptsUpload type="testing" />}
                    sidePanelTitle="Upload testing script"
                  >
                    <ScriptsList type="testing" />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.dhcp.index,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent sidePanelContent={null} sidePanelTitle={null}>
                    <DhcpList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.dhcp.add,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<DhcpAdd />}
                    sidePanelTitle="Add DHCP snippet"
                  >
                    <DhcpList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.dhcp.edit(null),
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<DhcpEdit />}
                    sidePanelTitle="Edit DHCP snippet"
                  >
                    <DhcpList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.repositories.index,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <RepositoriesList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.images.windows,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <Windows />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.images.vmware,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <VMWare />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.images.ubuntu,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <ThirdPartyDrivers />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.settings.images.source,
                urls.settings.index
              ),
              element: (
                <ErrorBoundary>
                  <ChangeSource />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute("*", urls.settings.index),
              element: <NotFound />,
            },
          ],
        },
        {
          path: "*",
          element: <NotFound includeSection />,
        },
      ],
    },
  ],
  {
    basename: `${import.meta.env.VITE_APP_BASENAME}${
      import.meta.env.VITE_APP_VITE_BASENAME
    }`,
  }
);
