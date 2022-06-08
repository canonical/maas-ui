import type { ReactNode } from "react";

import { formatDistance, parse } from "date-fns";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import controllerSelectors from "app/store/controller/selectors";
import { isControllerDetails } from "app/store/controller/utils";
import { version as versionSelectors } from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import {
  isDeployedWithHardwareSync,
  isMachineDetails,
} from "app/store/machine/utils";
import { NodeStatus } from "app/store/types/node";

const getTimeDistanceString = (utcTimeString: string) =>
  formatDistance(
    parse(
      `${utcTimeString} +00`, // let parse fn know it's UTC
      "E, dd LLL. yyyy HH:mm:ss x",
      new Date()
    ),
    new Date(),
    { addSuffix: true }
  );

const getLastCommissionedString = (machine: MachineDetails) => {
  if (machine.status === NodeStatus.COMMISSIONING) {
    return "Commissioning in progress...";
  } else if (machine.commissioning_start_time === "") {
    return "Not yet commissioned";
  }
  try {
    const distance = getTimeDistanceString(machine.commissioning_start_time);
    return `Last commissioned: ${distance}`;
  } catch (error) {
    return `Unable to parse commissioning timestamp (${
      error instanceof Error ? error.message : error
    })`;
  }
};

const getSyncStatusString = (syncStatus: string) => {
  if (syncStatus === "") {
    return "Never";
  }
  try {
    return getTimeDistanceString(syncStatus);
  } catch (error) {
    return `Unable to parse sync timestamp (${
      error instanceof Error ? error.message : error
    })`;
  }
};

export const StatusBar = (): JSX.Element | null => {
  const activeController = useSelector(controllerSelectors.active);
  const activeMachine = useSelector(machineSelectors.active);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);

  if (!(maasName && version)) {
    return null;
  }

  let status: ReactNode;
  if (isMachineDetails(activeMachine)) {
    const statuses = [activeMachine.fqdn];
    if (isDeployedWithHardwareSync(activeMachine)) {
      statuses.push(
        `Last synced: ${getSyncStatusString(activeMachine.last_sync)}`
      );
      statuses.push(
        `Next sync: ${getSyncStatusString(activeMachine.next_sync)}`
      );
    } else {
      statuses.push(getLastCommissionedString(activeMachine));
    }
    status = (
      <ul className="p-inline-list u-flex--wrap u-no-margin--bottom">
        {statuses.map((status, i) => (
          <li className="p-inline-list__item" key={status}>
            {i === 0 ? <strong>{status}</strong> : status}
          </li>
        ))}
      </ul>
    );
  } else if (isControllerDetails(activeController)) {
    status = `Last image sync: ${activeController.last_image_sync}`;
  }

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

export default StatusBar;
