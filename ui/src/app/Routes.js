import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import KVM from "app/kvm/views/KVM";
import Machines from "app/machines/views/Machines";
import NotFound from "app/base/views/NotFound";
import Preferences from "app/preferences/views/Preferences";
import RSD from "app/rsd/views/RSD";
import Settings from "app/settings/views/Settings";

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/machines" />
    </Route>
    <Route
      path="/account/prefs"
      render={() => (
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/kvm"
      render={() => (
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/machines"
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/pools"
      render={() => (
        <ErrorBoundary>
          <Machines />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/rsd"
      render={() => (
        <ErrorBoundary>
          <RSD />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/settings"
      render={() => (
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      )}
    />
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
