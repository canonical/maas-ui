import PropTypes from "prop-types";
import React from "react";

type Props = {
  maasName: string;
  status?: React.ReactNode;
  version: string;
};

export const StatusBar = ({
  maasName,
  status,
  version,
}: Props): JSX.Element => {
  return (
    <aside className="p-status-bar" aria-label="status bar">
      <div className="row">
        <div className="col-6">
          <strong data-testid="status-bar-maas-name">{maasName} MAAS</strong>:{" "}
          <span data-testid="status-bar-version">{version}</span>
        </div>
        {status && (
          <div className="col-6 u-align--right" data-testid="status-bar-status">
            {status}
          </div>
        )}
      </div>
    </aside>
  );
};

StatusBar.propTypes = {
  maasName: PropTypes.string.isRequired,
  status: PropTypes.node,
  version: PropTypes.string.isRequired,
};

export default StatusBar;
