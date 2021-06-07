import { Redirect, Route, Switch } from "react-router-dom";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import baseURLs from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import dashboardURLs from "app/dashboard/urls";
import Dashboard from "app/dashboard/views/Dashboard";
import domainsURLs from "app/domains/urls";
import Domains from "app/domains/views/Domains";
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
    <Route
      path={prefsURLs.prefs}
      render={() => (
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      )}
    />
    <Route
      path={domainsURLs.domains}
      render={() => (
        <ErrorBoundary>
          <Domains />
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
      path={settingsURLs.index}
      render={() => (
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      )}
    />
    <Route
      path={zonesURLs.index}
      render={() => (
        <ErrorBoundary>
          <Zones />
        </ErrorBoundary>
      )}
    />
    <Route
      path={dashboardURLs.dashboard}
      render={() => (
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      )}
    />
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
