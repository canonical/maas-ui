import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NodeLogs from "app/base/components/node/NodeLogs";
import { useWindowTitle } from "app/base/hooks";
import machineURLs from "app/machines/urls";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

export enum Label {
  Loading = "Loading logs",
}

const MachineLogs = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} logs`);

  if (!machine || !isMachineDetails(machine)) {
    return <Spinner aria-label={Label.Loading} text="Loading..." />;
  }
  return (
    <NodeLogs
      node={machine}
      urls={{
        events: machineURLs.machine.logs.events,
        index: machineURLs.machine.logs.index,
        installationOutput: machineURLs.machine.logs.installationOutput,
      }}
    />
  );
};

export default MachineLogs;
