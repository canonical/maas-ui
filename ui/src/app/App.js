import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { connectWebSocket } from "./base/actions";
import Main from "app/base/components/Main";
import Section from "app/base/components/Section";
import selectors from "./base/selectors";

export const App = ({ connected, connectionError, connectWebSocket }) => {
  useEffect(() => {
    // Connect the websocket before anything else in the app can be done.
    connectWebSocket();
  }, [connectWebSocket]);

  if (connectionError) {
    return (
      <Section title="Failed to connect. Please try refreshing your browser." />
    );
  }
  if (!connected) {
    return <Section title="Loading&hellip;" />;
  }
  // Anything that needs to a websocket connection can be done in Main
  // and children.
  return <Main />;
};

App.propTypes = {
  connected: PropTypes.bool,
  connectionError: PropTypes.object,
  connectWebSocket: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    connected: selectors.status.getConnected(state, props),
    connectionError: selectors.status.getError(state, props)
  };
};

const mapDispatchToProps = {
  connectWebSocket
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
