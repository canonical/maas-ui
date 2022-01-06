import { Redirect, Route, Switch } from "react-router-dom";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import baseURLs from "app/base/urls";
import NotFound from "app/base/views/NotFound";
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
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const Routes = (): JSX.Element => (
  <Switch>
    <Route exact path={baseURLs.index}>
      <Redirect to={machineURLs.machines.index} />
    </Route>
    <Route path={introURLs.index}>
      <ErrorBoundary>
        <Intro />
      </ErrorBoundary>
    </Route>
    <Route path={prefsURLs.prefs}>
      <ErrorBoundary>
        <Preferences />
      </ErrorBoundary>
    </Route>
    {[devicesURLs.devices.index, devicesURLs.device.index(null, true)].map(
      (path) => (
        <Route key={path} path={path}>
          <ErrorBoundary>
            <Devices />
          </ErrorBoundary>
        </Route>
      )
    )}
    {[domainsURLs.domains, domainsURLs.details(null, true)].map((path) => (
      <Route exact key={path} path={path}>
        <ErrorBoundary>
          <Domains />
        </ErrorBoundary>
      </Route>
    ))}
    <Route path={imagesURLs.index}>
      <ErrorBoundary>
        <Images />
      </ErrorBoundary>
    </Route>
    <Route path={kvmURLs.kvm}>
      <ErrorBoundary>
        <KVM />
      </ErrorBoundary>
    </Route>
    <Route path={machineURLs.machines.index}>
      <ErrorBoundary>
        <Machines />
      </ErrorBoundary>
    </Route>
    <Route path={machineURLs.machine.index(null, true)}>
      <ErrorBoundary>
        <MachineDetails />
      </ErrorBoundary>
    </Route>
    <Route path={poolsURLs.pools}>
      <ErrorBoundary>
        <Machines />
      </ErrorBoundary>
    </Route>
    <Route path={settingsURLs.index}>
      <ErrorBoundary>
        <Settings />
      </ErrorBoundary>
    </Route>
    {[zonesURLs.index, zonesURLs.details(null, true)].map((path) => (
      <Route exact key={path} path={path}>
        <ErrorBoundary>
          <Zones />
        </ErrorBoundary>
      </Route>
    ))}
    <Route path={dashboardURLs.index}>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </Route>
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
