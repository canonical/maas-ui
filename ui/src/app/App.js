import { connect } from "react-redux";
import Nav from "app/nav/components/Nav";
import PropTypes from "prop-types";
import React from "react";
import Routes from "./Routes";

import { connectWebSocket } from "./base/actions";
import selectors from "./base/selectors";

export class App extends React.Component {
  componentDidMount() {
    this.props.connectWebSocket();
  }

  render() {
    const { connectionError, connected } = this.props;
    if (connectionError) {
      return <div>Failed to connect. Please try refreshing your browser.</div>;
    }
    if (!connected) {
      return <div>Loading&hellip;</div>;
    }
    return (
      <div>
        <Nav />
        <Routes />
      </div>
    );
  }
}

App.propTypes = {
  connected: PropTypes.bool,
  connectionError: PropTypes.bool,
  connectWebSocket: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  return {
    connected: selectors.status.getConnected(state, props),
    connectionError: selectors.status.getError(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    connectWebSocket: () => {
      dispatch(connectWebSocket());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
