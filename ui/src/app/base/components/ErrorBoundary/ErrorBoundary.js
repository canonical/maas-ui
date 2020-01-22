import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // XXX: Add Sentry logging here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-notification--negative">
          <p className="p-notification__response">
            <span className="p-notification__status">Error:</span> An unexpected
            error hs occurred, please try refreshing your browser window.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
