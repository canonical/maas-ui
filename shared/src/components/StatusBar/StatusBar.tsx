import PropTypes from "prop-types";
import React from "react";

type Props = {
  version: string;
};

export const StatusBar = ({ version }: Props): JSX.Element => {
  const splitVersion = version.split(".");
  const major = splitVersion[0];
  const minor = splitVersion[1] || "";

  return (
    <div className="p-status-bar">
      <div className="row">
        <div className="col-12">
          <span data-test="status-bar-version">
            MAAS v{major}
            {minor ? `.${minor}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

StatusBar.propTypes = {
  version: PropTypes.string.isRequired,
};

export default StatusBar;
