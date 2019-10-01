import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import { useRouter } from "app/base/hooks";
import Details from "app/preferences/views/Details";
import SSHKeyList from "app/preferences/views/SSHKeyList";
import SSLKeyList from "app/preferences/views/SSLKeys/SSLKeyList";
import AddSSLKey from "app/preferences/views/SSLKeys/AddSSLKey";

const Routes = () => {
  const { match } = useRouter();
  return (
    <Switch>
      <Redirect exact from={`${match.path}/`} to={`${match.path}/details`} />
      <Route exact path={`${match.path}/details`} component={Details} />
      <Route exact path={`${match.path}/ssh-keys`} component={SSHKeyList} />
      <Route exact path={`${match.path}/ssl-keys`} component={SSLKeyList} />
      <Route exact path={`${match.path}/ssl-keys/add`} component={AddSSLKey} />
    </Switch>
  );
};

export default Routes;
