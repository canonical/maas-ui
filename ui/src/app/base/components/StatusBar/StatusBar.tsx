import { StatusBar as SharedStatusBar } from "@maas-ui/maas-ui-shared";
import { formatDistance, parse } from "date-fns";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import generalSelectors from "app/store/general/selectors";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { NodeStatus } from "app/store/types/node";

const getActiveMachineStatus = (machine: MachineDetails) => {
  if (machine.status === NodeStatus.COMMISSIONING) {
    return `${machine.fqdn}: Commissioning in progress...`;
  } else if (machine.commissioning_start_time === "") {
    return `${machine.fqdn}: Not yet commissioned`;
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
    return `${machine.fqdn}: Last commissioned ${distance}`;
  } catch (error) {
    return `${machine.fqdn}: Unable to parse commissioning timestamp (${error.message})`;
  }
};

export const StatusBar = (): JSX.Element | null => {
  const activeMachine = useSelector(machineSelectors.active);
  const version = useSelector(generalSelectors.version.get);
  const maasName = useSelector(configSelectors.maasName);

  if (!(maasName && version)) {
    return null;
  }

  let status = "";
  if (activeMachine && "commissioning_start_time" in activeMachine) {
    status = getActiveMachineStatus(activeMachine);
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
