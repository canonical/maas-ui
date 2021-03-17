import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useWindowTitle } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = { systemId: Machine["system_id"] };

const MachineNetwork = ({ systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} logs`);

  if (!machine) {
    return <Spinner text="Loading..." />;
  }

  return <>Logs</>;
};

export default MachineNetwork;
