import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { auth as authActions } from "app/base/actions";
import { auth as authSelectors } from "app/base/selectors";
import { config as configActions } from "app/settings/actions";
import { status } from "./base/selectors";
import { websocket } from "./base/actions";
import Header from "app/base/components/Header";
import Loader from "app/base/components/Loader";
import Notification from "app/base/components/Notification";
import Routes from "app/Routes";
import Section from "app/base/components/Section";

export const App = () => {
  const authUser = useSelector(authSelectors.get);
  const connected = useSelector(status.connected);
  const connectionError = useSelector(status.error);
  const authLoading = useSelector(authSelectors.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect the websocket before anything else in the app can be done.
    dispatch(websocket.connect());
  }, [dispatch]);

  useEffect(() => {
    if (connected) {
      dispatch(authActions.fetch());
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);

  let content;
  if (connectionError) {
    content = (
      <Section title="Failed to connect.">
        <Notification type="negative" status="Error:">
          The websocket failed to connect with the error "{connectionError}".
        </Notification>
      </Section>
    );
  } else if (!connected || authLoading) {
    content = <Section title={<Loader text="Loading..." />} />;
  } else if (!authUser) {
    content = (
      <Section title="You are not authenticated. Please log in to MAAS." />
    );
  } else if (!authUser.is_superuser) {
    content = <Section title="You do not have permission to view this page." />;
  } else {
    content = <Routes />;
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
};

export default App;
