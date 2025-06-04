import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditAliasOrVlanForm from "../EditAliasOrVlanForm";
import EditBondForm from "../EditBondForm";
import EditBridgeForm from "../EditBridgeForm";
import EditPhysicalForm from "../EditPhysicalForm";

import type {
  Selected,
  SetSelected,
} from "@/app/base/components/node/networking/types";
import machineSelectors from "@/app/store/machine/selectors";
import type { MachineDetails } from "@/app/store/machine/types";
import { isMachineDetails } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import type { NetworkInterface, NetworkLink } from "@/app/store/types/node";
import { getInterfaceType, getLinkFromNic } from "@/app/store/utils";

type Props = {
  readonly close: () => void;
  readonly linkId?: NetworkLink["id"] | null;
  readonly nicId?: NetworkInterface["id"] | null;
  readonly selected: Selected[];
  readonly setSelected: SetSelected;
  readonly systemId: MachineDetails["system_id"];
};

const EditInterface = ({
  close,
  linkId,
  nicId,
  selected,
  setSelected,
  systemId,
}: Props): React.ReactElement | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);
  if (!isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }
  const interfaceType = getInterfaceType(machine, nic, link);
  let form: ReactNode;
  if (interfaceType === NetworkInterfaceTypes.PHYSICAL) {
    form = (
      <EditPhysicalForm
        close={close}
        linkId={linkId}
        nicId={nicId}
        systemId={systemId}
      />
    );
  } else if (
    interfaceType === NetworkInterfaceTypes.ALIAS ||
    interfaceType === NetworkInterfaceTypes.VLAN
  ) {
    form = (
      <EditAliasOrVlanForm
        close={close}
        interfaceType={interfaceType}
        link={link}
        nic={nic}
        systemId={systemId}
      />
    );
  } else if (interfaceType === NetworkInterfaceTypes.BRIDGE) {
    form = (
      <EditBridgeForm close={close} link={link} nic={nic} systemId={systemId} />
    );
  } else if (interfaceType === NetworkInterfaceTypes.BOND) {
    form = (
      <EditBondForm
        close={close}
        link={link}
        nic={nic}
        selected={selected}
        setSelected={setSelected}
        systemId={systemId}
      />
    );
  }
  return <>{form}</>;
};

export default EditInterface;
