import React from "react";

import PropTypes from "prop-types";

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
      <div className="p-status-bar__row u-flex">
        <div className="p-status-bar__primary u-flex--no-shrink u-flex--wrap">
          <strong data-testid="status-bar-maas-name">{maasName} MAAS</strong>
          :&nbsp;
          <span data-testid="status-bar-version">{version}</span>
        </div>
        {status && (
          <div
            className="p-status-bar__secondary u-flex--grow u-flex--wrap"
            data-testid="status-bar-status"
          >
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
