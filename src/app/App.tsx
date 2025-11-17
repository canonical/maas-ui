import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

import {
  Application,
  AppStatus,
  Notification,
  NotificationProvider,
  ToastNotificationProvider,
} from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import * as Sentry from "@sentry/browser";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";

import packageInfo from "../../package.json";

import {
  useDismissNotification,
  useDismissNotifications,
} from "./api/query/notifications";
import NavigationBanner from "./base/components/AppSideNavigation/NavigationBanner";
import PageContent from "./base/components/PageContent/PageContent";
import SectionHeader from "./base/components/SectionHeader";
import ThemePreviewContextProvider from "./base/theme-context";
import { MAAS_UI_ID } from "./constants";

import { useGetCurrentUser } from "@/app/api/query/auth";
import AppSideNavigation from "@/app/base/components/AppSideNavigation";
import Login from "@/app/base/components/Login";
import StatusBar from "@/app/base/components/StatusBar";
import FileContext, { fileContextStore } from "@/app/base/file-context";
import { useFetchActions } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { generalActions } from "@/app/store/general";
import { statusActions } from "@/app/store/status";
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
        "warning" // Sentry.Severity.Warning is deprecated
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

export const App = (): React.ReactElement => {
  const dispatch = useDispatch();
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const configLoading = useSelector(configSelectors.loading);
  const configErrors = useSelector(configSelectors.errors);
  const previousAuthenticated = usePrevious(authenticated, false);
  const dismissMutation = useDismissNotification();
  const dismiss = useDismissNotifications(dismissMutation.mutate);

  const user = useGetCurrentUser({}, false);

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
      dispatch(generalActions.fetchVersion());
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);
  const isLoading =
    user.isPending ||
    authenticating ||
    configLoading ||
    (!connected && connecting);
  const hasAuthError = !authenticated && !connectionError;
  const hasVaultError =
    configErrors === VaultErrors.REQUEST_FAILED ||
    configErrors === VaultErrors.CONNECTION_FAILED;
  const isLoaded = user.isSuccess && authenticated;

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
          The server connection failed with the error "{configErrors}"
        </Notification>
      </PageContent>
    );
  } else if (isLoaded) {
    content = (
      <FileContext.Provider value={fileContextStore}>
        <Outlet />
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
    <Application id={MAAS_UI_ID}>
      <ThemePreviewContextProvider>
        <ToastNotificationProvider onDismiss={dismiss}>
          <NotificationProvider pathname={location.pathname}>
            <ConnectionStatus />
            {isLoaded ? (
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

            <Suspense
              fallback={
                <PageContent
                  header={<SectionHeader loading />}
                  sidePanelContent={null}
                  sidePanelTitle={null}
                />
              }
            >
              {content}
            </Suspense>
            {authenticated && (
              <AppStatus>
                <StatusBar />
              </AppStatus>
            )}
          </NotificationProvider>
        </ToastNotificationProvider>
      </ThemePreviewContextProvider>
    </Application>
  );
};

export default App;
