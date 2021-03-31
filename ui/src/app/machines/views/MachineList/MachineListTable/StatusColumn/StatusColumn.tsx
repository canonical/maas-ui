import * as React from "react";

import { Spinner, Tooltip } from "@canonical/react-components";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "app/base/components/DoubleRow";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isTransientStatus, useFormattedOS } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import {
  NodeActions,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import { getStatusText } from "app/utils";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  NodeStatusCode.COMMISSIONING,
  NodeStatusCode.FAILED_COMMISSIONING,
  NodeStatusCode.FAILED_TESTING,
  NodeStatusCode.NEW,
  NodeStatusCode.TESTING,
];

const getProgressText = (machine: Machine) => {
  if (isTransientStatus(machine.status_code)) {
    return machine.status_message;
  }
  return "";
};

const getStatusIcon = (machine: Machine) => {
  if (isTransientStatus(machine.status_code)) {
    return <Spinner data-test="status-icon" />;
  } else if (
    machine.testing_status.status === TestStatusStatus.FAILED &&
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

type Props = {
  onToggleMenu?: (systemId: string, open: boolean) => void;
  systemId: string;
};

export const StatusColumn = ({
  onToggleMenu,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const formattedOS = useFormattedOS(machine);
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);
  const actionLinks = useMachineActions(systemId, [
    NodeActions.ABORT,
    NodeActions.ACQUIRE,
    NodeActions.COMMISSION,
    NodeActions.DEPLOY,
    NodeActions.EXIT_RESCUE_MODE,
    NodeActions.LOCK,
    NodeActions.MARK_BROKEN,
    NodeActions.MARK_FIXED,
    NodeActions.OVERRIDE_FAILED_TESTING,
    NodeActions.RELEASE,
    NodeActions.RESCUE_MODE,
    NodeActions.TEST,
    NodeActions.UNLOCK,
  ]);

  const statusText = getStatusText(machine, formattedOS);
  const menuLinks = [
    actionLinks,
    [
      {
        children: "See logs",
        element: Link,
        to: `/machine/${systemId}/logs`,
      },
    ],
  ];

  if (machine) {
    return (
      <DoubleRow
        icon={getStatusIcon(machine)}
        iconSpace={true}
        menuLinks={onToggleMenu && menuLinks}
        menuTitle="Take action:"
        onToggleMenu={toggleMenu}
        primary={
          <span data-test="status-text" title={statusText}>
            {statusText}
          </span>
        }
        secondary={
          <>
            <span data-test="progress-text" title={getProgressText(machine)}>
              {getProgressText(machine)}
            </span>
            <span data-test="error-text">
              {machine.error_description &&
              machine.status_code === NodeStatusCode.BROKEN
                ? machine.error_description
                : ""}
            </span>
          </>
        }
      />
    );
  }
  return null;
};

StatusColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(StatusColumn);
