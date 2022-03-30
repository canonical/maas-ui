import type { ReactNode } from "react";

import { StatusBar as SharedStatusBar } from "@maas-ui/maas-ui-shared";
import { formatDistance, parse } from "date-fns";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import { version as versionSelectors } from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
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
    return `Last commissioned ${distance}`;
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
  const activeMachine = useSelector(machineSelectors.active);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);
  const isHardwareSyncEnabled =
    activeMachine &&
    "enable_hw_sync" in activeMachine &&
    activeMachine.enable_hw_sync === true;

  if (!(maasName && version)) {
    return null;
  }

  let status: ReactNode = "";
  if (isHardwareSyncEnabled) {
    status = (
      <ul className="p-inline-list u-no-margin--bottom">
        <li className="p-inline-list__item">
          <strong>{activeMachine.fqdn}</strong>
        </li>
        <li className="p-inline-list__item">
          Last synced: {getSyncStatusString(activeMachine.last_sync)}
        </li>
        <li className="p-inline-list__item">
          Next sync: {getSyncStatusString(activeMachine.next_sync)}
        </li>
      </ul>
    );
  } else if (activeMachine && "commissioning_start_time" in activeMachine) {
    const lastCommissioned = getLastCommissionedString(activeMachine);
    status = (
      <>
        <strong>{activeMachine.fqdn}</strong>: <span>{lastCommissioned}</span>
      </>
    );
  }

  return (
    <SharedStatusBar
      maasName={maasName as string}
      status={status}
      version={version}
    />
  );
};

export default StatusBar;
