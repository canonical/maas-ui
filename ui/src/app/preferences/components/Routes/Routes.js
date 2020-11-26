import React from "react";
import { Route, Redirect, Switch, useRouteMatch } from "react-router-dom";

import AddSSHKey from "app/preferences/views/SSHKeys/AddSSHKey";
import AddSSLKey from "app/preferences/views/SSLKeys/AddSSLKey";
import APIKeyAdd from "app/preferences/views/APIKeys/APIKeyAdd";
import APIKeyEdit from "app/preferences/views/APIKeys/APIKeyEdit";
import APIKeyList from "app/preferences/views/APIKeys/APIKeyList";
import Details from "app/preferences/views/Details";
import NotFound from "app/base/views/NotFound";
import SSHKeyList from "app/preferences/views/SSHKeys/SSHKeyList";
import SSLKeyList from "app/preferences/views/SSLKeys/SSLKeyList";

const Routes = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Redirect exact from={`${match.path}/`} to={`${match.path}/details`} />
      <Route exact path={`${match.path}/details`} component={Details} />
      <Route exact path={`${match.path}/api-keys`} component={APIKeyList} />
      <Route exact path={`${match.path}/api-keys/add`} component={APIKeyAdd} />
      <Route
        exact
        path={`${match.path}/api-keys/:id/edit`}
        component={APIKeyEdit}
      />
      <Route exact path={`${match.path}/ssh-keys`} component={SSHKeyList} />
      <Route exact path={`${match.path}/ssh-keys/add`} component={AddSSHKey} />
      <Route exact path={`${match.path}/ssl-keys`} component={SSLKeyList} />
      <Route exact path={`${match.path}/ssl-keys/add`} component={AddSSLKey} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
