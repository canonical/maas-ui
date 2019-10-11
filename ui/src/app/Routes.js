import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Machines from "app/machines/views/Machines";
import NotFound from "app/base/views/NotFound";
import Preferences from "app/preferences/views/Preferences";
import Settings from "app/settings/views/Settings";

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/machines" />
    <Route path="/settings" component={Settings} />
    <Route path="/machines" component={Machines} />
    <Route path="/account/prefs" component={Preferences} />
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
