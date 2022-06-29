import { Route, Redirect, Switch } from "react-router-dom";

import urls from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import APIKeyAdd from "app/preferences/views/APIKeys/APIKeyAdd";
import APIKeyEdit from "app/preferences/views/APIKeys/APIKeyEdit";
import APIKeyList from "app/preferences/views/APIKeys/APIKeyList";
import Details from "app/preferences/views/Details";
import AddSSHKey from "app/preferences/views/SSHKeys/AddSSHKey";
import SSHKeyList from "app/preferences/views/SSHKeys/SSHKeyList";
import AddSSLKey from "app/preferences/views/SSLKeys/AddSSLKey";
import SSLKeyList from "app/preferences/views/SSLKeys/SSLKeyList";

const Routes = (): JSX.Element => {
  return (
    <Switch>
      <Redirect
        exact
        from={urls.preferences.index}
        to={urls.preferences.details}
      />
      <Route exact path={urls.preferences.details} render={() => <Details />} />
      <Route
        exact
        path={urls.preferences.apiKeys.index}
        render={() => <APIKeyList />}
      />
      <Route
        exact
        path={urls.preferences.apiKeys.add}
        render={() => <APIKeyAdd />}
      />
      <Route
        exact
        path={urls.preferences.apiKeys.edit(null)}
        render={() => <APIKeyEdit />}
      />
      <Route
        exact
        path={urls.preferences.sshKeys.index}
        render={() => <SSHKeyList />}
      />
      <Route
        exact
        path={urls.preferences.sshKeys.add}
        render={() => <AddSSHKey />}
      />
      <Route
        exact
        path={urls.preferences.sslKeys.index}
        render={() => <SSLKeyList />}
      />
      <Route
        exact
        path={urls.preferences.sslKeys.add}
        render={() => <AddSSLKey />}
      />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Routes;
