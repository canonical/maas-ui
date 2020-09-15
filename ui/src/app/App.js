import { Link, useHistory, useLocation } from "react-router-dom";
import { Spinner, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import * as Sentry from "@sentry/browser";

import "../scss/index.scss";

import {
  auth as authActions,
  general as generalActions,
} from "app/base/actions";
import { getCookie } from "app/utils";
import { config as configActions } from "app/settings/actions";
import configSelectors from "app/store/config/selectors";
import { Footer, Header, navigateToLegacy } from "@maas-ui/maas-ui-shared";
import { status as statusActions } from "app/base/actions";
import { websocket } from "./base/actions";
import authSelectors from "app/store/auth/selectors";
import generalSelectors from "app/store/general/selectors";
import Login from "app/base/components/Login";
import Routes from "app/Routes";
import Section from "app/base/components/Section";
import status from "app/store/status/selectors";

export const App = () => {
  const history = useHistory();
  const location = useLocation();
  const authUser = useSelector(authSelectors.get);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authLoading = useSelector(authSelectors.loading);
  const navigationOptions = useSelector(generalSelectors.navigationOptions.get);
  const version = useSelector(generalSelectors.version.get);
  const maasName = useSelector(configSelectors.maasName);
  const uuid = useSelector(configSelectors.uuid);
  const completedIntro = useSelector(configSelectors.completedIntro);
  const dispatch = useDispatch();
  const debug = process.env.NODE_ENV === "development";

  useEffect(() => {
    dispatch(statusActions.checkAuthenticated());
  }, [dispatch]);

  useEffect(() => {
    if (authenticated) {
      // Connect the websocket before anything else in the app can be done.
      dispatch(websocket.connect());
    }
  }, [dispatch, authenticated]);

  useEffect(() => {
    if (connected) {
      dispatch(authActions.fetch());
      dispatch(generalActions.fetchVersion());
      dispatch(generalActions.fetchNavigationOptions());
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);

  // the skipintro cookie is set by Cypress to make integration testing easier
  const skipIntro = getCookie("skipintro");
  if (!skipIntro) {
    // Explicitly check that completedIntro is false so that it doesn't redirect
    // if the config isn't defined yet.
    if (completedIntro === false) {
      navigateToLegacy("/intro");
    } else if (authUser && !authUser.completed_intro) {
      navigateToLegacy("/intro/user");
    }
  }

  let content;
  if (authLoading || connecting || authenticating) {
    content = (
      <Section
        header={
          <>
            <span className="p-heading--four"></span>
            <Spinner
              className="u-no-padding u-no-margin"
              inline
              text="Loading..."
            />
          </>
        }
      />
    );
  } else if (!authenticated && !connectionError) {
    content = <Login />;
  } else if (connectionError || !connected) {
    content = (
      <Section header="Failed to connect.">
        <Notification type="negative" status="Error:">
          The server connection failed
          {connectionError ? ` with the error "${connectionError}"` : ""}.
        </Notification>
      </Section>
    );
  } else if (connected) {
    content = <Routes />;
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
        completedIntro={completedIntro && authUser && authUser.completed_intro}
        debug={debug}
        enableAnalytics={analyticsEnabled}
        generateLocalLink={(url, label, linkClass) => (
          <Link className={linkClass} to={url}>
            {label}
          </Link>
        )}
        location={location}
        logout={() => {
          dispatch(statusActions.websocketDisconnect());
          dispatch(statusActions.logout());
          if (window.legacyWS) {
            window.legacyWS.close();
          }
        }}
        showRSD={navigationOptions.rsd}
        urlChange={history.listen}
        uuid={uuid}
        version={version}
      />
      {content}
      {maasName && version && (
        <Footer
          debug={debug}
          enableAnalytics={analyticsEnabled}
          maasName={maasName}
          version={version}
        />
      )}
    </div>
  );
};

export default App;
