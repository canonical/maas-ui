import { lazy } from "react";

import { Navigate, Route, Routes as ReactRouterRoutes } from "react-router-dom";

import ErrorBoundary from "@/app/base/components/ErrorBoundary";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";

const ControllerDetails = lazy(
  async () => import("@/app/controllers/views/ControllerDetails")
);
const ControllerList = lazy(
  async () => import("@/app/controllers/views/ControllerList")
);
const DeviceDetails = lazy(
  async () => import("@/app/devices/views/DeviceDetails")
);
const DeviceList = lazy(async () => import("@/app/devices/views/DeviceList"));
const DomainDetails = lazy(
  async () => import("@/app/domains/views/DomainDetails")
);
const DomainsList = lazy(async () => import("@/app/domains/views/DomainsList"));
const ImageList = lazy(async () => import("@/app/images/views/ImageList"));
const Intro = lazy(async () => import("@/app/intro/views/Intro"));
const KVM = lazy(async () => import("@/app/kvm/views/KVM"));
const MachineDetails = lazy(
  async () => import("@/app/machines/views/MachineDetails")
);
const Machines = lazy(async () => import("@/app/machines/views/Machines"));
const NetworkDiscovery = lazy(
  async () => import("@/app/networkDiscovery/views/NetworkDiscovery")
);
const Pools = lazy(async () => import("@/app/pools/views/Pools"));
const Preferences = lazy(
  async () => import("@/app/preferences/views/Preferences")
);
const Settings = lazy(async () => import("@/app/settings/views/Settings"));
const FabricDetails = lazy(
  async () => import("@/app/subnets/views/FabricDetails")
);
const SpaceDetails = lazy(
  async () => import("@/app/subnets/views/SpaceDetails")
);
const SubnetDetails = lazy(
  async () => import("@/app/subnets/views/SubnetDetails")
);
const SubnetsList = lazy(async () => import("@/app/subnets/views/SubnetsList"));
const VLANDetails = lazy(async () => import("@/app/subnets/views/VLANDetails"));
const Tags = lazy(async () => import("@/app/tags/views/Tags"));
const ZonesList = lazy(async () => import("@/app/zones/views/ZonesList"));

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route
      element={<Navigate replace to={urls.machines.index} />}
      path={urls.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      }
      path={urls.machines.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <ZonesList />
        </ErrorBoundary>
      }
      path={`${urls.zones.index}`}
    />
    <Route
      element={
        <ErrorBoundary>
          <NetworkDiscovery />
        </ErrorBoundary>
      }
      path={`${urls.networkDiscovery.index}/*`}
    />
    <Route
      element={<Navigate replace to={urls.networkDiscovery.index} />}
      path={urls.networkDiscovery.legacyIndex}
    />
    <Route
      element={<Navigate replace to={urls.networkDiscovery.configuration} />}
      path={urls.networkDiscovery.legacyConfiguration}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceList />
        </ErrorBoundary>
      }
      path={`${urls.devices.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceDetails />
        </ErrorBoundary>
      }
      path={`${urls.devices.device.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DomainsList />
        </ErrorBoundary>
      }
      path={`${urls.domains.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DomainDetails />
        </ErrorBoundary>
      }
      path={`${urls.domains.details(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${urls.tags.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${urls.tags.tag.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SpaceDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.space.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      }
      path={`${urls.settings.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      }
      path={`${urls.intro.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ImageList />
        </ErrorBoundary>
      }
      path={`${urls.images.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      }
      path={`${urls.preferences.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      }
      path={`${urls.machines.machine.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <FabricDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.fabric.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ControllerDetails />
        </ErrorBoundary>
      }
      path={`${urls.controllers.controller.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ControllerList />
        </ErrorBoundary>
      }
      path={`${urls.controllers.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      }
      path={`${urls.kvm.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Pools />
        </ErrorBoundary>
      }
      path={`${urls.pools.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetsList />
        </ErrorBoundary>
      }
      path={`${urls.subnets.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.subnet.index(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <VLANDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.vlan.index(null)}/*`}
    />
    <Route element={<NotFound includeSection />} path="*" />
  </ReactRouterRoutes>
);

export default Routes;
