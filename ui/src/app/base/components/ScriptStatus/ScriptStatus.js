import { Tooltip } from "@canonical/react-components";
import PropTypes from "prop-types";

import { ScriptResultStatus } from "app/store/scriptresult/types";

const ScriptStatus = ({
  children,
  hidePassedIcon = false,
  scriptType,
  tooltipPosition,
}) => {
  switch (scriptType.status) {
    case ScriptResultStatus.PASSED: {
      return hidePassedIcon ? (
        children
      ) : (
        <>
          <i className="p-icon--success is-inline" />
          {children}
        </>
      );
    }

    case ScriptResultStatus.DEGRADED:
    case ScriptResultStatus.FAILED:
    case ScriptResultStatus.FAILED_APPLYING_NETCONF:
    case ScriptResultStatus.FAILED_INSTALLING: {
      return (
        <Tooltip
          message="Machine has failed tests."
          position={tooltipPosition}
          positionElementClassName="p-double-row__tooltip-inner"
        >
          <i className="p-icon--error is-inline" />
          {children}
        </Tooltip>
      );
    }

    case ScriptResultStatus.TIMEDOUT: {
      return (
        <Tooltip
          message="Machine has tests that have timed out."
          position={tooltipPosition}
          positionElementClassName="p-double-row__tooltip-inner"
        >
          <i className="p-icon--timed-out is-inline" />
          {children}
        </Tooltip>
      );
    }

    case ScriptResultStatus.APPLYING_NETCONF:
    case ScriptResultStatus.INSTALLING:
    case ScriptResultStatus.RUNNING: {
      return (
        <>
          <i className="p-icon--running is-inline" />
          {children}
        </>
      );
    }

    case ScriptResultStatus.PENDING: {
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
    failed: PropTypes.number,
  }).isRequired,
  tooltipPosition: PropTypes.oneOf([
    "btm-center",
    "btm-left",
    "btm-right",
    "left",
    "right",
    "top-center",
    "top-left",
    "top-right",
  ]),
};

export default ScriptStatus;
