import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

import ImageList from "./images/views/ImageList";
import Pools from "./pools/views/Pools";
import Tags from "./tags/views/Tags";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import Controllers from "app/controllers/views/Controllers";
import Dashboard from "app/dashboard/views/Dashboard";
import DeviceDetails from "app/devices/views/DeviceDetails";
import DeviceList from "app/devices/views/DeviceList";
import Domains from "app/domains/views/Domains";
import Intro from "app/intro/views/Intro";
import KVM from "app/kvm/views/KVM";
import MachineDetails from "app/machines/views/MachineDetails";
import Machines from "app/machines/views/Machines";
import Preferences from "app/preferences/views/Preferences";
import Settings from "app/settings/views/Settings";
import FabricDetails from "app/subnets/views/FabricDetails";
import SpaceDetails from "app/subnets/views/SpaceDetails";
import SubnetDetails from "app/subnets/views/SubnetDetails";
import SubnetsList from "app/subnets/views/SubnetsList";
import VLANDetails from "app/subnets/views/VLANDetails";
import ZoneDetails from "app/zones/views/ZoneDetails";
import ZonesList from "app/zones/views/ZonesList";

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route element={<Redirect to={urls.machines.index} />} path={urls.index} />
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
          <Preferences />
        </ErrorBoundary>
      }
      path={`${urls.preferences.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      }
      path={`${urls.controllers.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      }
      path={`${urls.controllers.controller.index(null)}/*`}
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
          <Domains />
        </ErrorBoundary>
      }
      path={`${urls.domains.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Domains />
        </ErrorBoundary>
      }
      path={`${urls.domains.details(null)}/*`}
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
          <KVM />
        </ErrorBoundary>
      }
      path={`${urls.kvm.index}/*`}
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
          <MachineDetails />
        </ErrorBoundary>
      }
      path={`${urls.machines.machine.index(null)}/*`}
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
          <Settings />
        </ErrorBoundary>
      }
      path={`${urls.settings.index}/*`}
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
          <FabricDetails />
        </ErrorBoundary>
      }
      path={`${urls.subnets.fabric.index(null)}/*`}
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
          <ZoneDetails />
        </ErrorBoundary>
      }
      path={`${urls.zones.details(null)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      }
      path={`${urls.dashboard.index}/*`}
    />
    <Route element={<NotFound includeSection />} path="*" />
  </ReactRouterRoutes>
);

export default Routes;
