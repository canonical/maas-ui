import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import React from "react";
import PropTypes from "prop-types";

import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import { nodeStatus, scriptStatus } from "app/base/enum";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import DoubleRow from "app/base/components/DoubleRow";
import Tooltip from "app/base/components/Tooltip";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  nodeStatus.COMMISSIONING,
  nodeStatus.FAILED_COMMISSIONING,
  nodeStatus.FAILED_TESTING,
  nodeStatus.NEW,
  nodeStatus.TESTING,
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
  nodeStatus.TESTING,
];

// Script statuses associated with failure.
const failedScriptStatuses = [
  scriptStatus.DEGRADED,
  scriptStatus.FAILED,
  scriptStatus.FAILED_APPLYING_NETCONF,
  scriptStatus.FAILED_INSTALLING,
  scriptStatus.TIMEDOUT,
];

const getStatusText = (machine, osReleases) => {
  if (formattedReleaseStatuses.includes(machine.status_code)) {
    const machineRelease = osReleases.find(
      (release) => release.value === machine.distro_series
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

const getProgressText = (machine) => {
  if (transientStatuses.includes(machine.status_code)) {
    return machine.status_message;
  }
  return "";
};

const getStatusIcon = (machine) => {
  if (transientStatuses.includes(machine.status_code)) {
    return (
      <Spinner
        className="u-no-margin u-no-padding"
        data-test="status-icon"
        inline
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

export const StatusColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const osReleases = useSelector((state) =>
    generalSelectors.osInfo.getOsReleases(state, machine.osystem)
  );
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);

  const actionLinks = useMachineActions(systemId, [
    "abort",
    "acquire",
    "commission",
    "deploy",
    "exit-rescue-mode",
    "lock",
    "mark-broken",
    "mark-fixed",
    "override-failed-testing",
    "release",
    "rescue-mode",
    "test",
    "unlock",
  ]);

  const menuLinks = [
    actionLinks,
    [
      {
        children: "See logs",
        element: "a",
        href: `${process.env.REACT_APP_BASENAME}/#/machine/${systemId}?area=logs`,
      },
      {
        children: "See events",
        element: "a",
        href: `${process.env.REACT_APP_BASENAME}/#/machine/${systemId}?area=events`,
      },
    ],
  ];

  return (
    <DoubleRow
      icon={getStatusIcon(machine)}
      iconSpace={true}
      menuLinks={menuLinks}
      menuTitle="Take action:"
      onToggleMenu={toggleMenu}
      primary={
        <span
          data-test="status-text"
          title={getStatusText(machine, osReleases)}
        >
          {getStatusText(machine, osReleases)}
        </span>
      }
      secondary={
        <span data-test="progress-text" title={getProgressText(machine)}>
          {getProgressText(machine)}
        </span>
      }
    />
  );
};

StatusColumn.propTypes = {
  onToggleMenu: PropTypes.func.isRequired,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(StatusColumn);
