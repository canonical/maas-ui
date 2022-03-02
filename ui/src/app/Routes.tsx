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
import tagURLs from "app/tags/urls";
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const Routes = (): JSX.Element => (
  <Switch>
    <Route
      exact
      path={baseURLs.index}
      render={() => <Redirect to={machineURLs.machines.index} />}
    />
    <Route
      path={introURLs.index}
      render={() => (
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      )}
    />
    <Route
      path={prefsURLs.prefs}
      render={() => (
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      )}
    />
    <Route
      path={controllersURLs.controllers.index}
      render={() => (
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
          render={() => (
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
        render={() => (
          <ErrorBoundary>
            <Domains />
          </ErrorBoundary>
        )}
      />
    ))}
    <Route
      path={imagesURLs.index}
      render={() => (
        <ErrorBoundary>
          <Images />
        </ErrorBoundary>
      )}
    />
    <Route
      path={kvmURLs.kvm}
      render={() => (
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      )}
    />
    <Route
      path={machineURLs.machines.index}
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={machineURLs.machine.index(null, true)}
      render={() => (
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      )}
    />
    <Route
      path={poolsURLs.pools}
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={tagURLs.tags.index}
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={tagURLs.tag.index(null, true)}
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path={settingsURLs.index}
      render={() => (
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
        render={() => (
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
        render={() => (
          <ErrorBoundary>
            <Zones />
          </ErrorBoundary>
        )}
      />
    ))}
    <Route
      path={dashboardURLs.index}
      render={() => (
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      )}
    />
    <Route path="*" render={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
