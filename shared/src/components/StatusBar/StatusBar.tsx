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
    <div className="p-status-bar">
      <div className="row">
        <div className="col-6">
          <span data-test="status-bar-maas-name">{maasName} MAAS</span>:{" "}
          <span data-test="status-bar-version">{version}</span>
        </div>
        {status && (
          <div className="col-6 u-align--right" data-test="status-bar-status">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

StatusBar.propTypes = {
  maasName: PropTypes.string.isRequired,
  status: PropTypes.node,
  version: PropTypes.string.isRequired,
};

export default StatusBar;
