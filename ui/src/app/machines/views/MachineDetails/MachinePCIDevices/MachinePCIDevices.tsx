import { useSelector } from "react-redux";

import NodeDevices from "../NodeDevices";

import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { MachineSetHeaderContent } from "app/machines/types";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = { setHeaderContent: MachineSetHeaderContent };

const MachinePCIDevices = ({ setHeaderContent }: Props): JSX.Element | null => {
  const id = useGetURLId(MachineMeta.PK);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${`${machine?.fqdn || "Machine"} `} PCI devices`);

  if (isMachineDetails(machine)) {
    return (
      <NodeDevices
        bus={NodeDeviceBus.PCIE}
        machine={machine}
        setHeaderContent={setHeaderContent}
      />
    );
  }
  return null;
};

export default MachinePCIDevices;
