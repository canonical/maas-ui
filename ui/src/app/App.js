import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { auth as authActions } from "app/base/actions";
import { status as statusActions } from "app/base/actions";
import { auth as authSelectors } from "app/base/selectors";
import { config as configActions } from "app/settings/actions";
import { status } from "app/base/selectors";
import { useLocation } from "app/base/hooks";
import { websocket } from "./base/actions";
import Header from "app/base/components/Header";
import Loader from "app/base/components/Loader";
import Login from "app/base/components/Login";
import Notification from "app/base/components/Notification";
import Routes from "app/Routes";
import Section from "app/base/components/Section";

export const App = () => {
  const { location } = useLocation();
  const authUser = useSelector(authSelectors.get);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const authLoading = useSelector(authSelectors.loading);
  const dispatch = useDispatch();

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
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);

  let content;
  if (authLoading || connecting || authenticating) {
    content = <Section title={<Loader text="Loading..." />} />;
  } else if (!authenticated) {
    content = <Login />;
  } else if (connectionError) {
    content = (
      <Section title="Failed to connect.">
        <Notification type="negative" status="Error:">
          The websocket failed to connect with the error "{connectionError}".
        </Notification>
      </Section>
    );
  } else if (connected) {
    content = <Routes />;
  }

  return (
    <>
      <Header
        authUser={authUser}
        basename={process.env.REACT_APP_BASENAME}
        generateLocalLink={(url, label, linkClass) => (
          <Link className={linkClass} to={url}>
            {label}
          </Link>
        )}
        location={location}
        logout={() => {
          dispatch(statusActions.logout());
        }}
      />
      {content}
    </>
  );
};

export default App;
