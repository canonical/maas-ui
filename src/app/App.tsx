import type { ReactNode } from "react";
import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import * as Sentry from "@sentry/browser";
import { useDispatch, useSelector } from "react-redux";

import packageInfo from "../../package.json";

import Routes from "./Routes";
import NavigationBanner from "./base/components/AppSideNavigation/NavigationBanner";
import PageContent from "./base/components/PageContent/PageContent";
import SectionHeader from "./base/components/SectionHeader";
import ThemePreviewContextProvider from "./base/theme-context";
import { MAAS_UI_ID } from "./constants";
import { formatErrors } from "./utils";

import AppSideNavigation from "@/app/base/components/AppSideNavigation";
import Login from "@/app/base/components/Login";
import StatusBar from "@/app/base/components/StatusBar";
import FileContext, { fileContextStore } from "@/app/base/file-context";
import { useFetchActions } from "@/app/base/hooks";
import { actions as authActions } from "@/app/store/auth";
import authSelectors from "@/app/store/auth/selectors";
import { actions as configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { actions as generalActions } from "@/app/store/general";
import { actions as statusActions } from "@/app/store/status";
import status from "@/app/store/status/selectors";

export enum VaultErrors {
  REQUEST_FAILED = "Vault request failed",
  CONNECTION_FAILED = "Vault connection failed",
}

const ConnectionStatus = () => {
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const authenticated = useSelector(status.authenticated);
  const shouldDisplayConnectionError =
    authenticated && (!!connectionError || (!connecting && !connected));

  useEffect(() => {
    if (connectionError) {
      Sentry.captureMessage(
        `Connection Error: ${connectionError}`,
        Sentry.Severity.Warning
      );
    }
  }, [connectionError]);

  return shouldDisplayConnectionError ? (
    <div className="p-modal" style={{ alignItems: "flex-start" }}>
      <section
        className="p-modal__dialog"
        style={{
          paddingTop: "1rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <h5 className="u-no-margin--bottom u-no-padding--top">
          Trying to reconnect...
        </h5>
      </section>
    </div>
  ) : null;
};

export const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const authenticationError = useSelector(status.authenticationError);
  const authLoading = useSelector(authSelectors.loading);
  const authLoaded = useSelector(authSelectors.loaded);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const configLoading = useSelector(configSelectors.loading);
  const configErrors = useSelector(configSelectors.errors);
  const previousAuthenticated = usePrevious(authenticated, false);

  useFetchActions([statusActions.checkAuthenticated]);

  useEffect(() => {
    // Needs to be fetched again to know if external auth is being used.
    if (previousAuthenticated && !authenticated) {
      dispatch(statusActions.checkAuthenticated());
    }
  }, [authenticated, dispatch, previousAuthenticated]);

  useEffect(() => {
    if (authenticated) {
      // Connect the websocket before anything else in the app can be done.
      dispatch(statusActions.websocketConnect());
    }
  }, [dispatch, authenticated]);

  useEffect(() => {
    if (connected) {
      dispatch(authActions.fetch());
      dispatch(generalActions.fetchVersion());
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);
  const isLoading =
    authLoading ||
    authenticating ||
    configLoading ||
    (!connected && connecting);
  const hasAuthError = !authenticated && !connectionError;
  const hasVaultError =
    configErrors === VaultErrors.REQUEST_FAILED ||
    configErrors === VaultErrors.CONNECTION_FAILED;
  const isLoaded = authLoaded && authenticated;

  let content: ReactNode = null;
  // display loading spinner only on initial load
  // this prevents flashing of the loading screen when websocket connection is lost and restored
  if (!isLoaded && isLoading) {
    content = (
      <PageContent
        header={<SectionHeader loading />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  } else if (hasAuthError) {
    content = (
      <PageContent sidePanelContent={null} sidePanelTitle={null}>
        {authenticationError ? (
          authenticationError === "Session expired" ? (
            <Notification role="alert" severity="information">
              Your session has expired. Plese log in again to continue using
              MAAS.
            </Notification>
          ) : (
            <Notification role="alert" severity="negative" title="Error:">
              {formatErrors(authenticationError, "__all__")}
            </Notification>
          )
        ) : null}
        <Login />
      </PageContent>
    );
  } else if (hasVaultError) {
    content = (
      <PageContent
        header={<SectionHeader title="Failed to connect" />}
        sidePanelContent={null}
        sidePanelTitle={null}
      >
        <Notification severity="negative" title="Error:">
          The server connection failed
          {hasVaultError || connectionError
            ? ` with the error "${
                hasVaultError ? configErrors : connectionError
              }"`
            : ""}
        </Notification>
      </PageContent>
    );
  } else if (isLoaded) {
    content = (
      <FileContext.Provider value={fileContextStore}>
        <Routes />
      </FileContext.Provider>
    );
  }

  if (analyticsEnabled && import.meta.env.VITE_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_APP_SENTRY_DSN,
      release: packageInfo.version,
    });
  }

  return (
    <div className="l-application" id={MAAS_UI_ID}>
      <ThemePreviewContextProvider>
        <ConnectionStatus />
        {authLoaded && authenticated ? (
          <AppSideNavigation />
        ) : (
          <header className="l-navigation-bar is-pinned">
            <div className="p-panel is-dark is-maas-default">
              <div className="p-panel__header">
                <NavigationBanner />
              </div>
            </div>
          </header>
        )}

        {content}
        <aside className="l-status">
          <StatusBar />
        </aside>
      </ThemePreviewContextProvider>
    </div>
  );
};

export default App;
