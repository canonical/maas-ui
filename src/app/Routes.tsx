import { lazy } from "react";

import { Redirect, Route, Routes as ReactRouterRoutes } from "react-router-dom";

import ErrorBoundary from "@/app/base/components/ErrorBoundary";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";

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
const NetworkDiscovery = lazy(
  () => import("@/app/networkDiscovery/views/NetworkDiscovery")
);
const Pools = lazy(() => import("@/app/pools/views/Pools"));
const Preferences = lazy(() => import("@/app/preferences/views/Preferences"));
const Settings = lazy(() => import("@/app/settings/views/Settings"));
const FabricDetails = lazy(() => import("@/app/subnets/views/FabricDetails"));
const SpaceDetails = lazy(() => import("@/app/subnets/views/SpaceDetails"));
const SubnetDetails = lazy(() => import("@/app/subnets/views/SubnetDetails"));
const SubnetsList = lazy(() => import("@/app/subnets/views/SubnetsList"));
const VLANDetails = lazy(() => import("@/app/subnets/views/VLANDetails"));
const Tags = lazy(() => import("@/app/tags/views/Tags"));
const ZoneDetails = lazy(() => import("@/app/zones/views/ZoneDetails"));
const ZonesList = lazy(() => import("@/app/zones/views/ZonesList"));

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route element={<Redirect to={urls.machines.index} />} path={urls.index} />
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
          <ZoneDetails />
        </ErrorBoundary>
      }
      path={`${urls.zones.details(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <ZonesList />
        </ErrorBoundary>
      }
      path={`${urls.zones.index}/*`}
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
      element={<Redirect to={urls.networkDiscovery.index} />}
      path={urls.networkDiscovery.legacyIndex}
    />
    <Route
      element={<Redirect to={urls.networkDiscovery.configuration} />}
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
