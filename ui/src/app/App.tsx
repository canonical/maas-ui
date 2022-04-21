import type { ReactNode } from "react";
import { useEffect } from "react";

import { Notification } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Footer, Header } from "@maas-ui/maas-ui-shared";
import * as Sentry from "@sentry/browser";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";

import Routes from "app/Routes";
import Login from "app/base/components/Login";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import StatusBar from "app/base/components/StatusBar";
import FileContext, { fileContextStore } from "app/base/file-context";
import { useCompletedIntro, useCompletedUserIntro } from "app/base/hooks";
import introURLs from "app/intro/urls";
import { actions as authActions } from "app/store/auth";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { actions as generalActions } from "app/store/general";
import { version as versionSelectors } from "app/store/general/selectors";
import { actions as statusActions } from "app/store/status";
import status from "app/store/status/selectors";

declare global {
  interface Window {
    legacyWS: WebSocket;
  }
}

export const App = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const authLoading = useSelector(authSelectors.loading);
  const authUser = useSelector(authSelectors.get);
  const configLoaded = useSelector(configSelectors.loaded);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const uuid = useSelector(configSelectors.uuid);
  const version = useSelector(versionSelectors.get);
  const previousAuthenticated = usePrevious(authenticated, false);
  const completedIntro = useCompletedIntro();
  const completedUserIntro = useCompletedUserIntro();
  const debug = process.env.NODE_ENV === "development";

  useEffect(() => {
    dispatch(statusActions.checkAuthenticated());
  }, [dispatch]);

  useEffect(() => {
    // When a user logs out the redux store is reset so the authentication
    // info needs to be fetched again to know if external auth is being used.
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

  // Redirect to the intro pages if not completed.
  useEffect(() => {
    if (configLoaded) {
      if (!completedIntro) {
        history.push({ pathname: introURLs.index });
      } else if (!!authUser && !completedUserIntro) {
        history.push({ pathname: introURLs.user });
      }
    }
  }, [
    authUser,
    connected,
    completedIntro,
    completedUserIntro,
    configLoaded,
    history,
  ]);

  let content: ReactNode = null;
  if (authLoading || connecting || authenticating) {
    content = <Section header={<SectionHeader loading />} />;
  } else if (!authenticated && !connectionError) {
    content = <Login />;
  } else if (connectionError || !connected) {
    content = (
      <Section header={<SectionHeader title="Failed to connect" />}>
        <Notification severity="negative" title="Error:">
          The server connection failed
          {connectionError ? ` with the error "${connectionError}"` : ""}.
        </Notification>
      </Section>
    );
  } else if (connected) {
    content = (
      <FileContext.Provider value={fileContextStore}>
        <Routes />
      </FileContext.Provider>
    );
  }

  if (analyticsEnabled && process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
    });
  }

  return (
    <div id="maas-ui">
      <Header
        appendNewBase={false}
        authUser={authUser}
        completedIntro={completedIntro && completedUserIntro}
        debug={debug}
        enableAnalytics={analyticsEnabled as boolean}
        generateNewLink={({ label, url, isSelected, ...props }) =>
          url ? (
            <Link {...props} to={url}>
              {label}
            </Link>
          ) : (
            // Handle elements that don't need to navigate using react-router
            // e.g. the logout link.
            <a {...props}>{label}</a>
          )
        }
        location={location}
        logout={() => {
          dispatch(statusActions.logout());
          if (window.legacyWS) {
            window.legacyWS.close();
          }
        }}
        urlChange={history.listen}
        uuid={uuid as string}
        version={version}
      />
      <main id="main-content">{content}</main>
      {version && (
        <Footer
          debug={debug}
          enableAnalytics={analyticsEnabled as boolean}
          version={version}
        />
      )}
      <StatusBar />
    </div>
  );
};

export default App;
