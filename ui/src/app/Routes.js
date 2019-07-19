import React from "react";
import { Route, Switch } from "react-router-dom";

import Settings from "app/settings/containers/Settings";

// This component currently routes everying to settings, but exists to
// facilitate more top level URLS in the future.
const Routes = () => (
  <Switch>
    <Route path="/" component={Settings} />
  </Switch>
);

export default Routes;
