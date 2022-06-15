import { Redirect } from "react-router-dom";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

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
import Subnets from "app/subnets/views/Subnets";
import tagURLs from "app/tags/urls";
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const Routes = (): JSX.Element => (
  <ReactRouterRoutes>
    <Route
      path={baseURLs.index}
      element={<Redirect to={machineURLs.machines.index} />}
    />
    <Route
      path={`${introURLs.index}/*}`}
      element={
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      }
    />
    <Route
      path={prefsURLs.prefs}
      element={
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      }
    />
    {[
      controllersURLs.controllers.index,
      controllersURLs.controller.index(null, true),
    ].map((path) => (
      <Route
        key={path}
        path={path}
        element={
          <ErrorBoundary>
            <Controllers />
          </ErrorBoundary>
        }
      />
    ))}
    <Route
      path={devicesURLs.devices.index}
      element={
        <ErrorBoundary>
          <DeviceList />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${devicesURLs.device.index(null, true)}/*`}
      element={
        <ErrorBoundary>
          <DeviceDetails />
        </ErrorBoundary>
      }
    />
    {[domainsURLs.domains, domainsURLs.details(null, true)].map((path) => (
      <Route
        key={path}
        path={path}
        element={
          <ErrorBoundary>
            <Domains />
          </ErrorBoundary>
        }
      />
    ))}
    <Route
      path={imagesURLs.index}
      element={
        <ErrorBoundary>
          <Images />
        </ErrorBoundary>
      }
    />
    <Route
      path={kvmURLs.kvm}
      element={
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      }
    />
    <Route
      path={machineURLs.machines.index}
      element={
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      }
    />
    <Route
      path={machineURLs.machine.index(null, true)}
      element={
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      }
    />
    <Route
      path={poolsURLs.pools}
      element={
        <ErrorBoundary>
          <Pools />
        </ErrorBoundary>
      }
    />
    <Route
      path={tagURLs.tags.index}
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
    />
    <Route
      path={tagURLs.tag.index(null, true)}
      element={
        <ErrorBoundary>
          <Tags />
        </ErrorBoundary>
      }
    />
    <Route
      path={settingsURLs.index}
      element={
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      }
    />
    {[
      subnetsURLs.index,
      subnetsURLs.fabric.index(null, true),
      subnetsURLs.space.index(null, true),
      subnetsURLs.subnet.index(null, true),
      subnetsURLs.vlan.index(null, true),
    ].map((path) => (
      <Route
        key={path}
        path={path}
        element={
          <ErrorBoundary>
            <Subnets />
          </ErrorBoundary>
        }
      />
    ))}
    {[zonesURLs.index, zonesURLs.details(null, true)].map((path) => (
      <Route
        key={path}
        path={path}
        element={
          <ErrorBoundary>
            <Zones />
          </ErrorBoundary>
        }
      />
    ))}
    <Route
      path={dashboardURLs.index}
      element={
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      }
    />
    <Route path="*" element={<NotFound includeSection />} />
  </ReactRouterRoutes>
);

export default Routes;
