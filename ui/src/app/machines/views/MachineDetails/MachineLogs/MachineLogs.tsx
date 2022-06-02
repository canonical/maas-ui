import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import NodeLogs from "app/base/components/node/NodeLogs";
import { useWindowTitle } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
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

  if (!machine) {
    return <Spinner aria-label={Label.Loading} text="Loading..." />;
  }
  return <NodeLogs node={machine} />;
};

export default MachineLogs;
