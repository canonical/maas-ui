import { useSelector } from "react-redux";
import { useParams } from "react-router";

import NodeDevices from "../NodeDevices";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import type { MachineSetSelectedAction } from "app/machines/views/types";
import machineSelectors from "app/store/machine/selectors";
import { isMachineDetails } from "app/store/machine/utils";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { RootState } from "app/store/root/types";

type Props = { setSelectedAction: MachineSetSelectedAction };

const MachineUSBDevices = ({
  setSelectedAction,
}: Props): JSX.Element | null => {
  const { id } = useParams<RouteParams>();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${`${machine?.fqdn || "Machine"} `} PCI devices`);

  if (isMachineDetails(machine)) {
    return (
      <NodeDevices
        bus={NodeDeviceBus.USB}
        machine={machine}
        setSelectedAction={setSelectedAction}
      />
    );
  }
  return null;
};

export default MachineUSBDevices;
