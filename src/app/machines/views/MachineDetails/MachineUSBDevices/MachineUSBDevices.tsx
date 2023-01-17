import { useSelector } from "react-redux";

import NodeDevices from "app/base/components/node/NodeDevices";
import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { MachineSetSidePanelContent } from "app/machines/types";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = { setSidePanelContent: MachineSetSidePanelContent };

const MachineUSBDevices = ({
  setSidePanelContent,
}: Props): JSX.Element | null => {
  const id = useGetURLId(MachineMeta.PK);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${`${machine?.fqdn || "Machine"} `} PCI devices`);

  if (isMachineDetails(machine)) {
    return (
      <NodeDevices
        bus={NodeDeviceBus.USB}
        node={machine}
        setSidePanelContent={setSidePanelContent}
      />
    );
  }
  return null;
};

export default MachineUSBDevices;
