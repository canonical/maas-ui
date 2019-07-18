import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { connectWebSocket } from "./base/actions";
import Routes from "./Routes";
import Section from "app/base/components/Section";
import selectors from "./base/selectors";

export function App(props) {
  const { connectWebSocket } = props;
  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  const { connectionError, connected } = props;
  if (connectionError) {
    return (
      <Section title="Failed to connect. Please try refreshing your browser." />
    );
  }
  if (!connected) {
    return <Section title="Loading&hellip;" />;
  }
  return <Routes />;
}

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
