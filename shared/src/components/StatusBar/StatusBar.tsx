import PropTypes from "prop-types";
import React from "react";

type Props = {
  maasName: string;
  version: string;
};

export const StatusBar = ({ maasName, version }: Props): JSX.Element => {
  return (
    <div className="p-status-bar">
      <div className="row">
        <div className="col-12">
          <span data-test="status-bar-maas-name">{maasName} MAAS</span>:{" "}
          <span data-test="status-bar-version">{version}</span>
        </div>
      </div>
    </div>
  );
};

StatusBar.propTypes = {
  maasName: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};

export default StatusBar;
