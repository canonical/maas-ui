import { Redirect, Route, Switch } from "react-router-dom";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import baseURLs from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";
import Controllers from "app/controllers/views/Controllers";
import dashboardURLs from "app/dashboard/urls";
import Dashboard from "app/dashboard/views/Dashboard";
import devicesURLs from "app/devices/urls";
import Devices from "app/devices/views/Devices";
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
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const Routes = (): JSX.Element => (
  <Switch>
    <Route
      exact
      path={baseURLs.index}
      component={() => <Redirect to={machineURLs.machines.index} />}
    />
    <Route
      path={introURLs.index}
      component={() => (
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      )}
    />
    <Route
      path={prefsURLs.prefs}
      component={() => (
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      )}
    />
    <Route
      path={controllersURLs.controllers.index}
      component={() => (
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      )}
    />
    {[devicesURLs.devices.index, devicesURLs.device.index(null, true)].map(
      (path) => (
        <Route
          key={path}
          path={path}
          component={() => (
            <ErrorBoundary>
              <Devices />
            </ErrorBoundary>
          )}
        />
      )
    )}
    {[domainsURLs.domains, domainsURLs.details(null, true)].map((path) => (
      <Route
        exact
        key={path}
        path={path}
        component={() => (
          <ErrorBoundary>
            <Domains />
          </ErrorBoundary>
        )}
      />
    ))}
    <Route
      path={imagesURLs.index}
      component={() => (
        <ErrorBoundary>
          <Images />
        </ErrorBoundary>
      )}
    />
    <Route
      path={kvmURLs.kvm}
      component={() => (
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      )}
    />
    <Route
      path={machineURLs.machines.index}
      component={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={machineURLs.machine.index(null, true)}
      component={() => (
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      )}
    />
    <Route
      path={poolsURLs.pools}
      component={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={settingsURLs.index}
      component={() => (
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      )}
    />
    {[
      subnetsURLs.index,
      subnetsURLs.fabric.index(null, true),
      subnetsURLs.space.index(null, true),
      subnetsURLs.subnet.index(null, true),
      subnetsURLs.vlan.index(null, true),
    ].map((path) => (
      <Route
        exact
        key={path}
        path={path}
        component={() => (
          <ErrorBoundary>
            <Subnets />
          </ErrorBoundary>
        )}
      />
    ))}
    {[zonesURLs.index, zonesURLs.details(null, true)].map((path) => (
      <Route
        exact
        key={path}
        path={path}
        component={() => (
          <ErrorBoundary>
            <Zones />
          </ErrorBoundary>
        )}
      />
    ))}
    <Route
      path={dashboardURLs.index}
      component={() => (
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      )}
    />
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
