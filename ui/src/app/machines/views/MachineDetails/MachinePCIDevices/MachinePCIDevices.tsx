import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../MachineSummary";
import NodeDevices from "../NodeDevices";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = { setSelectedAction: SetSelectedAction };

const MachinePCIDevices = ({
  setSelectedAction,
}: Props): JSX.Element | null => {
  const { id } = useParams<RouteParams>();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${`${machine?.fqdn || "Machine"} `} PCI devices`);

  if (machine && "numa_nodes" in machine) {
    return (
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        setSelectedAction={setSelectedAction}
      />
    );
  }
  return null;
};

export default MachinePCIDevices;
