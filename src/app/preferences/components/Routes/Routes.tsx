import { Redirect } from "react-router";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

import DeleteSSHKey from "../../views/SSHKeys/DeleteSSHKey";
import DeleteSSLKey from "../../views/SSLKeys/DeleteSSLKey";

import PageContent from "@/app/base/components/PageContent";
import urls from "@/app/base/urls";
import NotFound from "@/app/base/views/NotFound";
import APIKeyAdd from "@/app/preferences/views/APIKeys/APIKeyAdd";
import APIKeyDelete from "@/app/preferences/views/APIKeys/APIKeyDelete";
import APIKeyEdit from "@/app/preferences/views/APIKeys/APIKeyEdit";
import APIKeyList from "@/app/preferences/views/APIKeys/APIKeyList";
import Details from "@/app/preferences/views/Details";
import { Labels as PreferenceLabels } from "@/app/preferences/views/Preferences";
import AddSSHKey from "@/app/preferences/views/SSHKeys/AddSSHKey";
import SSHKeyList from "@/app/preferences/views/SSHKeys/SSHKeyList";
import AddSSLKey from "@/app/preferences/views/SSLKeys/AddSSLKey";
import SSLKeyList from "@/app/preferences/views/SSLKeys/SSLKeyList";
import { getRelativeRoute } from "@/app/utils";

const Routes = (): JSX.Element => {
  const base = urls.preferences.index;
  return (
    <ReactRouterRoutes>
      <Route element={<Redirect to={urls.preferences.details} />} path="/" />
      <Route
        element={
          <PageContent
            aria-label={PreferenceLabels.Title}
            sidePanelContent={null}
            sidePanelTitle={null}
          >
            <Details />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.details, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <APIKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.apiKeys.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<APIKeyAdd />}
            sidePanelTitle="Generate MAAS API key"
          >
            <APIKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.apiKeys.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<APIKeyEdit />}
            sidePanelTitle="Edit MAAS API key"
          >
            <APIKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.apiKeys.edit(null), base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<APIKeyDelete />}
            sidePanelTitle="Delete MAAS API key"
          >
            <APIKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.apiKeys.delete(null), base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SSHKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sshKeys.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<AddSSHKey />}
            sidePanelTitle="Add SSH key"
          >
            <SSHKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sshKeys.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<DeleteSSHKey />}
            sidePanelTitle="Delete SSH key"
          >
            <SSHKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sshKeys.delete, base)}
      />
      <Route
        element={
          <PageContent sidePanelContent={null} sidePanelTitle={null}>
            <SSLKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sslKeys.index, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<AddSSLKey />}
            sidePanelTitle="Add SSL key"
          >
            <SSLKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sslKeys.add, base)}
      />
      <Route
        element={
          <PageContent
            sidePanelContent={<DeleteSSLKey />}
            sidePanelTitle="Delete SSL key"
          >
            <SSLKeyList />
          </PageContent>
        }
        path={getRelativeRoute(urls.preferences.sslKeys.delete(null), base)}
      />
      <Route element={<NotFound />} path="*" />
    </ReactRouterRoutes>
  );
};

export default Routes;
