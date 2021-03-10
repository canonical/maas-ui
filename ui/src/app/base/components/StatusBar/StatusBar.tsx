import type { ReactNode } from "react";

import { StatusBar as SharedStatusBar } from "@maas-ui/maas-ui-shared";
import { formatDistance, parse } from "date-fns";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import { version as versionSelectors } from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { NodeStatus } from "app/store/types/node";

const getLastCommissionedString = (machine: MachineDetails) => {
  if (machine.status === NodeStatus.COMMISSIONING) {
    return "Commissioning in progress...";
  } else if (machine.commissioning_start_time === "") {
    return "Not yet commissioned";
  }
  try {
    const distance = formatDistance(
      parse(
        `${machine.commissioning_start_time} +00`, // let parse fn know it's UTC
        "E, dd LLL. yyyy HH:mm:ss x",
        new Date()
      ),
      new Date(),
      { addSuffix: true }
    );
    return `Last commissioned ${distance}`;
  } catch (error) {
    return `Unable to parse commissioning timestamp (${error.message})`;
  }
};

export const StatusBar = (): JSX.Element | null => {
  const activeMachine = useSelector(machineSelectors.active);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);

  if (!(maasName && version)) {
    return null;
  }

  let status: ReactNode = "";
  if (activeMachine && "commissioning_start_time" in activeMachine) {
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
