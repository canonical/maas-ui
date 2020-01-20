import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import {
  general as generalSelectors,
  machine as machineSelectors
} from "app/base/selectors";
import { nodeStatus, scriptStatus } from "app/base/enum";
import Tooltip from "app/base/components/Tooltip";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  nodeStatus.COMMISSIONING,
  nodeStatus.FAILED_COMMISSIONING,
  nodeStatus.FAILED_TESTING,
  nodeStatus.NEW,
  nodeStatus.TESTING
];

// Node statuses for which the OS + release is made human-readable.
const formattedReleaseStatuses = [nodeStatus.DEPLOYED, nodeStatus.DEPLOYING];

// Node statuses that are temporary.
const transientStatuses = [
  nodeStatus.COMMISSIONING,
  nodeStatus.DEPLOYING,
  nodeStatus.DISK_ERASING,
  nodeStatus.ENTERING_RESCUE_MODE,
  nodeStatus.EXITING_RESCUE_MODE,
  nodeStatus.RELEASING,
  nodeStatus.TESTING
];

// Script statuses associated with failure.
const failedScriptStatuses = [
  scriptStatus.DEGRADED,
  scriptStatus.FAILED,
  scriptStatus.FAILED_APPLYING_NETCONF,
  scriptStatus.FAILED_INSTALLING,
  scriptStatus.TIMEDOUT
];

const getStatusText = (machine, osReleases) => {
  if (formattedReleaseStatuses.includes(machine.status_code)) {
    const machineRelease = osReleases.find(
      release => release.value === machine.distro_series
    );

    if (machineRelease) {
      let releaseTitle;
      if (machine.osystem === "ubuntu") {
        releaseTitle = machineRelease.label.split('"')[0].trim();
      } else {
        releaseTitle = machineRelease.label;
      }

      if (machine.status_code === nodeStatus.DEPLOYING) {
        return `Deploying ${releaseTitle}`;
      }
      return releaseTitle;
    }
  }
  return machine.status;
};

const getProgressText = machine => {
  if (transientStatuses.includes(machine.status_code)) {
    return machine.status_message;
  }
  return "";
};

const getStatusIcon = machine => {
  if (transientStatuses.includes(machine.status_code)) {
    return (
      <i
        className="p-icon--spinner u-animation--spin"
        data-test="status-icon"
      />
    );
  } else if (
    failedScriptStatuses.includes(machine.testing_status.status) &&
    !hideFailedTestWarningStatuses.includes(machine.status_code)
  ) {
    return (
      <Tooltip
        message="Machine has failed tests; use with caution."
        position="top-left"
      >
        <i className="p-icon--warning" data-test="status-icon" />
      </Tooltip>
    );
  }
  return "";
};

const StatusColumn = ({ systemId }) => {
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const osReleases = useSelector(state =>
    generalSelectors.osInfo.getOsReleases(state, machine.osystem)
  );

  return (
    <div className="p-double-row--with-icon">
      <div className="p-double-row__icon">{getStatusIcon(machine)}</div>
      <div
        className="p-double-row__primary-row u-truncate-text"
        data-test="status-text"
        title={getStatusText(machine, osReleases)}
      >
        {getStatusText(machine, osReleases)}
      </div>
      <div
        className="p-double-row__secondary-row u-truncate-text"
        data-test="progress-text"
        title={getProgressText(machine)}
      >
        {getProgressText(machine)}
      </div>
    </div>
  );
};

StatusColumn.propTypes = {
  systemId: PropTypes.string.isRequired
};

export default StatusColumn;
