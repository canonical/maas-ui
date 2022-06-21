import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

import SSFTest from "./SSFTest";
import Pools from "./pools/views/Pools";
import Tags from "./tags/views/Tags";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import baseURLs from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";
import Controllers from "app/controllers/views/Controllers";
import dashboardURLs from "app/dashboard/urls";
import Dashboard from "app/dashboard/views/Dashboard";
import devicesURLs from "app/devices/urls";
import DeviceDetails from "app/devices/views/DeviceDetails";
import DeviceList from "app/devices/views/DeviceList";
import domainsURLs from "app/domains/urls";
import Domains from "app/domains/views/Domains";
import imagesURLs from "app/images/urls";
import Images from "app/images/views/Images";
import introURLs from "app/intro/urls";
import Intro from "app/intro/views/Intro";
import kvmURLs from "app/kvm/urls";
import KVM from "app/kvm/views/KVM";
import machineURLs from "app/machines/urls";
import MachineDetails from "app/machines/views/MachineDetails";
import Machines from "app/machines/views/Machines";
import poolsURLs from "app/pools/urls";
import prefsURLs from "app/preferences/urls";
import Preferences from "app/preferences/views/Preferences";
import settingsURLs from "app/settings/urls";
import Settings from "app/settings/views/Settings";
import subnetsURLs from "app/subnets/urls";
import FabricDetails from "app/subnets/views/FabricDetails";
import SpaceDetails from "app/subnets/views/SpaceDetails";
import SubnetDetails from "app/subnets/views/SubnetDetails";
import SubnetsList from "app/subnets/views/SubnetsList";
import VLANDetails from "app/subnets/views/VLANDetails";
import tagURLs from "app/tags/urls";
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route
      element={<Redirect to={machineURLs.machines.index} />}
      path={baseURLs.index}
    />
    <Route
      element={
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      }
      path={`${introURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      }
      path={`${prefsURLs.prefs}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      }
      path={`${controllersURLs.controllers.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      }
      path={`${controllersURLs.controller.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceList />
        </ErrorBoundary>
      }
      path={`${devicesURLs.devices.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <DeviceDetails />
        </ErrorBoundary>
      }
      path={`${devicesURLs.device.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Domains />
        </ErrorBoundary>
      }
      path={`${domainsURLs.domains}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Domains />
        </ErrorBoundary>
      }
      path={`${domainsURLs.details(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Images />
        </ErrorBoundary>
      }
      path={`${imagesURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      }
      path={`${kvmURLs.kvm}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      }
      path={`${machineURLs.machines.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      }
      path={`${machineURLs.machine.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Pools />
        </ErrorBoundary>
      }
      path={`${poolsURLs.pools}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${tagURLs.tags.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
      path={`${tagURLs.tag.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      }
      path={`${settingsURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetsList />
        </ErrorBoundary>
      }
      path={`${subnetsURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <FabricDetails />
        </ErrorBoundary>
      }
      path={`${subnetsURLs.fabric.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SpaceDetails />
        </ErrorBoundary>
      }
      path={`${subnetsURLs.space.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SubnetDetails />
        </ErrorBoundary>
      }
      path={`${subnetsURLs.subnet.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <VLANDetails />
        </ErrorBoundary>
      }
      path={`${subnetsURLs.vlan.index(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Zones />
        </ErrorBoundary>
      }
      path={`${zonesURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Zones />
        </ErrorBoundary>
      }
      path={`${zonesURLs.details(null, true)}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      }
      path={`${dashboardURLs.index}/*`}
    />
    <Route
      element={
        <ErrorBoundary>
          <SSFTest />
        </ErrorBoundary>
      }
      path={"/ssf-test"}
    />
    <Route element={<NotFound includeSection />} path="*" />
  </ReactRouterRoutes>
);

export default Routes;
