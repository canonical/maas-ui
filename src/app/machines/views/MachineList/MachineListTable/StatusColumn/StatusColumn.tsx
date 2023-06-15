import * as React from "react";

import { Spinner, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import DoubleRow from "app/base/components/DoubleRow";
import TooltipButton from "app/base/components/TooltipButton";
import { useMachineActions } from "app/base/hooks";
import { useToggleMenu } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isTransientStatus, useFormattedOS } from "app/store/machine/utils";
import { isUnconfiguredPowerType } from "app/store/machine/utils/common";
import type { RootState } from "app/store/root/types";
import {
  NodeActions,
  NodeStatusCode,
  TestStatusStatus,
} from "app/store/types/node";
import { breakLines, getStatusText } from "app/utils";

// Node statuses for which the failed test warning is not shown.
const hideFailedTestWarningStatuses = [
  NodeStatusCode.COMMISSIONING,
  NodeStatusCode.FAILED_COMMISSIONING,
  NodeStatusCode.FAILED_TESTING,
  NodeStatusCode.NEW,
  NodeStatusCode.TESTING,
];

const getProgressText = (machine: Machine) => {
  if (isTransientStatus(machine.status_code) && machine.status_message) {
    return machine.status_message;
  }
  return "";
};

const getStatusIcon = (machine: Machine) => {
  if (isTransientStatus(machine.status_code)) {
    return <Spinner data-testid="status-icon" />;
  } else if (
    machine.testing_status.status === TestStatusStatus.FAILED &&
    !hideFailedTestWarningStatuses.includes(machine.status_code)
  ) {
    return (
      <TooltipButton
        iconName="warning"
        iconProps={{ "data-testid": "status-icon" }}
        message="Machine has failed tests; use with caution."
        position="top-left"
      />
    );
  } else if (isUnconfiguredPowerType(machine)) {
    return (
      <TooltipButton
        aria-label="Unconfigured power type"
        iconName="error"
        message="Unconfigured power type. Go to the configuration tab of this machine."
      />
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
  const formattedOS = useFormattedOS(machine, true);
  const toggleMenu = useToggleMenu(onToggleMenu || null, systemId);
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
    const progressText = getProgressText(machine);

    return (
      <DoubleRow
        icon={getStatusIcon(machine)}
        iconSpace={true}
        menuLinks={onToggleMenu ? menuLinks : null}
        menuTitle="Take action:"
        onToggleMenu={toggleMenu}
        primary={
          <span data-testid="status-text" title={statusText}>
            {statusText}
          </span>
        }
        secondary={
          <>
            <span data-testid="progress-text" title={progressText}>
              {progressText}
            </span>
            <span data-testid="error-text">
              {machine.error_description &&
              machine.status_code === NodeStatusCode.BROKEN ? (
                <Tooltip
                  message={breakLines(machine.error_description)}
                  position="btm-left"
                  positionElementClassName="p-double-row__tooltip-inner"
                  tooltipClassName="p-tooltip--fixed-width"
                >
                  {machine.error_description}
                </Tooltip>
              ) : (
                ""
              )}
            </span>
          </>
        }
      />
    );
  }
  return null;
};

export default React.memo(StatusColumn);
