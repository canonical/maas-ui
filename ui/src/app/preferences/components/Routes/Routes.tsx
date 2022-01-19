import { Route, Redirect, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import prefsURLs from "app/preferences/urls";
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
      <Redirect exact from={prefsURLs.prefs} to={prefsURLs.details} />
      <Route exact path={prefsURLs.details} render={Details} />
      <Route exact path={prefsURLs.apiKeys.index} render={APIKeyList} />
      <Route exact path={prefsURLs.apiKeys.add} render={APIKeyAdd} />
      <Route
        exact
        path={prefsURLs.apiKeys.edit(null, true)}
        render={APIKeyEdit}
      />
      <Route exact path={prefsURLs.sshKeys.index} render={SSHKeyList} />
      <Route exact path={prefsURLs.sshKeys.add} render={AddSSHKey} />
      <Route exact path={prefsURLs.sslKeys.index} render={SSLKeyList} />
      <Route exact path={prefsURLs.sslKeys.add} render={AddSSLKey} />
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Routes;
