import { Redirect } from "react-router";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom-v5-compat";

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
import { getRelativeRoute } from "app/utils";

const Routes = (): JSX.Element => {
  const base = urls.preferences.index;
  return (
    <ReactRouterRoutes>
      <Route element={<Redirect to={urls.preferences.details} />} path="/" />
      <Route
        element={<Details />}
        path={getRelativeRoute(urls.preferences.details, base)}
      />
      <Route
        element={<APIKeyList />}
        path={getRelativeRoute(urls.preferences.apiKeys.index, base)}
      />
      <Route
        element={<APIKeyAdd />}
        path={getRelativeRoute(urls.preferences.apiKeys.add, base)}
      />
      <Route
        element={<APIKeyEdit />}
        path={getRelativeRoute(urls.preferences.apiKeys.edit(null), base)}
      />
      <Route
        element={<SSHKeyList />}
        path={getRelativeRoute(urls.preferences.sshKeys.index, base)}
      />
      <Route
        element={<AddSSHKey />}
        path={getRelativeRoute(urls.preferences.sshKeys.add, base)}
      />
      <Route
        element={<SSLKeyList />}
        path={getRelativeRoute(urls.preferences.sslKeys.index, base)}
      />
      <Route
        element={<AddSSLKey />}
        path={getRelativeRoute(urls.preferences.sslKeys.add, base)}
      />
      <Route element={<NotFound />} path="*" />
    </ReactRouterRoutes>
  );
};

export default Routes;
