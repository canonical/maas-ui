import PropTypes from "prop-types";
import React from "react";

import { scriptStatus } from "app/base/enum";
import Tooltip from "app/base/components/Tooltip";

const ScriptStatus = ({
  children,
  hidePassedIcon = false,
  scriptType,
  tooltipPosition
}) => {
  switch (scriptType.status) {
    case scriptStatus.PASSED: {
      return hidePassedIcon ? (
        children
      ) : (
        <>
          <i className="p-icon--success is-inline" />
          {children}
        </>
      );
    }

    case scriptStatus.DEGRADED:
    case scriptStatus.FAILED:
    case scriptStatus.FAILED_APPLYING_NETCONF:
    case scriptStatus.FAILED_INSTALLING: {
      return (
        <Tooltip message="Machine has failed tests." position={tooltipPosition}>
          <i className="p-icon--error is-inline" />
          {children}
        </Tooltip>
      );
    }

    case scriptStatus.TIMEDOUT: {
      return (
        <Tooltip
          message="Machine has tests that have timed out."
          position={tooltipPosition}
        >
          <i className="p-icon--timed-out is-inline" />
          {children}
        </Tooltip>
      );
    }

    case scriptStatus.APPLYING_NETCONF:
    case scriptStatus.INSTALLING:
    case scriptStatus.RUNNING: {
      return (
        <>
          <i className="p-icon--running is-inline" />
          {children}
        </>
      );
    }

    case scriptStatus.PENDING: {
      return (
        <>
          <i className="p-icon--pending is-inline" />
          {children}
        </>
      );
    }

    default:
      return children;
  }
};

ScriptStatus.propTypes = {
  children: PropTypes.node.isRequired,
  hidePassedIcon: PropTypes.bool,
  scriptType: PropTypes.shape({
    status: PropTypes.number,
    pending: PropTypes.number,
    running: PropTypes.number,
    passed: PropTypes.number,
    failed: PropTypes.number
  }).isRequired,
  tooltipPosition: PropTypes.oneOf([
    "btm-center",
    "btm-left",
    "btm-right",
    "left",
    "right",
    "top-center",
    "top-left",
    "top-right"
  ])
};

export default ScriptStatus;
