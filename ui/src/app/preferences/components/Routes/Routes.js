import { Route, Redirect, Switch } from "react-router-dom";

import prefsURLs from "app/preferences/urls";
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
  return (
    <Switch>
      <Redirect exact from={prefsURLs.prefs} to={prefsURLs.details} />
      <Route exact path={prefsURLs.details} component={Details} />
      <Route exact path={prefsURLs.apiKeys.index} component={APIKeyList} />
      <Route exact path={prefsURLs.apiKeys.add} component={APIKeyAdd} />
      <Route
        exact
        path={prefsURLs.apiKeys.edit(null, true)}
        component={APIKeyEdit}
      />
      <Route exact path={prefsURLs.sshKeys.index} component={SSHKeyList} />
      <Route exact path={prefsURLs.sshKeys.add} component={AddSSHKey} />
      <Route exact path={prefsURLs.sslKeys.index} component={SSLKeyList} />
      <Route exact path={prefsURLs.sslKeys.add} component={AddSSLKey} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
