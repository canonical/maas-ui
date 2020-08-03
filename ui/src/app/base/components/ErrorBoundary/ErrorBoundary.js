import React from "react";
import * as Sentry from "@sentry/browser";
import { connect } from "react-redux";

import configSelectors from "app/store/config/selectors";
import generalSelectors from "app/store/general/selectors";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, eventId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { analyticsEnabled, maasVersion } = this.props;

    if (analyticsEnabled) {
      Sentry.withScope((scope) => {
        scope.setExtras({ ...errorInfo, maasVersion });
        scope.setTag("maas.version", maasVersion);
        const eventId = Sentry.captureException(error);
        this.setState({ eventId });
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-notification--negative">
          <p className="p-notification__response u-no-max-width">
            <span className="p-notification__status">Error:</span> An unexpected
            error has occurred, please try refreshing your browser window.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
const mapStateToProps = (state) => ({
  analyticsEnabled: configSelectors.analyticsEnabled(state),
  maasVersion: generalSelectors.version.get(state),
});

export default connect(mapStateToProps)(ErrorBoundary);
