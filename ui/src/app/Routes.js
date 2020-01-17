import React from "react";
import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import Preferences from "app/preferences/views/Preferences";
import Settings from "app/settings/views/Settings";

const Routes = () => (
  <Switch>
    <Route
      exact
      path="/"
      component={() => {
        window.location.href = `${process.env.REACT_APP_BASENAME}/#/machines`;
        return null;
      }}
    />
    <Route path="/settings" component={Settings} />
    <Route path="/account/prefs" component={Preferences} />
    <Route path="*" component={() => <NotFound includeSection />} />
  </Switch>
);

export default Routes;
