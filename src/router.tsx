import { lazy } from "react";

import { createBrowserRouter, Navigate } from "react-router";

import App from "@/app/App";
import ErrorBoundary from "@/app/base/components/ErrorBoundary";
import PageContent from "@/app/base/components/PageContent";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import APIKeyAdd from "@/app/preferences/views/APIKeys/APIKeyAdd";
import APIKeyDelete from "@/app/preferences/views/APIKeys/APIKeyDelete";
import APIKeyEdit from "@/app/preferences/views/APIKeys/APIKeyEdit";
import APIKeyList from "@/app/preferences/views/APIKeys/APIKeyList";
import Details from "@/app/preferences/views/Details";
import SSHKeysList from "@/app/preferences/views/SSHKeys/views";
import SSLKeysList from "@/app/preferences/views/SSLKeys/views";
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
const PoolsList = lazy(() => import("@/app/pools/views/PoolsList"));
const Settings = lazy(() => import("@/app/settings/views/Settings"));
const FabricDetails = lazy(() => import("@/app/subnets/views/FabricDetails"));
const SpaceDetails = lazy(() => import("@/app/subnets/views/SpaceDetails"));
const SubnetDetails = lazy(() => import("@/app/subnets/views/SubnetDetails"));
const SubnetsList = lazy(() => import("@/app/subnets/views/SubnetsList"));
const VLANDetails = lazy(() => import("@/app/subnets/views/VLANDetails"));
const Tags = lazy(() => import("@/app/tags/views/Tags"));
const ZonesList = lazy(() => import("@/app/zones/views"));

const base = urls.preferences.index;
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
              <Tags />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.tags.tag.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <Tags />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.subnets.space.index(null)}/*`,
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
              path: getRelativeRoute(urls.preferences.details, base),
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
              path: getRelativeRoute(urls.preferences.apiKeys.index, base),
              element: (
                <ErrorBoundary>
                  <PageContent sidePanelContent={null} sidePanelTitle={null}>
                    <APIKeyList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(urls.preferences.apiKeys.add, base),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<APIKeyAdd />}
                    sidePanelTitle="Generate MAAS API key"
                  >
                    <APIKeyList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(urls.preferences.apiKeys.edit(null), base),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<APIKeyEdit />}
                    sidePanelTitle="Edit MAAS API key"
                  >
                    <APIKeyList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(
                urls.preferences.apiKeys.delete(null),
                base
              ),
              element: (
                <ErrorBoundary>
                  <PageContent
                    sidePanelContent={<APIKeyDelete />}
                    sidePanelTitle="Delete MAAS API key"
                  >
                    <APIKeyList />
                  </PageContent>
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(urls.preferences.sshKeys, base),
              element: (
                <ErrorBoundary>
                  <SSHKeysList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute(urls.preferences.sslKeys, base),
              element: (
                <ErrorBoundary>
                  <SSLKeysList />
                </ErrorBoundary>
              ),
            },
            {
              path: getRelativeRoute("*", base),
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
          path: `${urls.subnets.fabric.index(null)}/*`,
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
          path: `${urls.subnets.index}/*`,
          element: (
            <ErrorBoundary>
              <SubnetsList />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.subnets.subnet.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <SubnetDetails />
            </ErrorBoundary>
          ),
        },
        {
          path: `${urls.subnets.vlan.index(null)}/*`,
          element: (
            <ErrorBoundary>
              <VLANDetails />
            </ErrorBoundary>
          ),
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
