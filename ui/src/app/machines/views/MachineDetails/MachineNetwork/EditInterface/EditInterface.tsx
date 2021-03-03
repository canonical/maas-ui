import type { ReactNode } from "react";

import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditAliasOrVlanForm from "../EditAliasOrVlanForm";
import EditPhysicalForm from "../EditPhysicalForm";
import InterfaceFormTable from "../InterfaceFormTable";

import FormCard from "app/base/components/FormCard";
import machineSelectors from "app/store/machine/selectors";
import { NetworkInterfaceTypes } from "app/store/machine/types";
import type {
  MachineDetails,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import { getInterfaceType, getLinkFromNic } from "app/store/machine/utils";
import { INTERFACE_TYPE_DISPLAY } from "app/store/machine/utils/networking";
import type { RootState } from "app/store/root/types";

type Props = {
  close: () => void;
  linkId?: NetworkLink["id"] | null;
  nicId?: NetworkInterface["id"] | null;
  systemId: MachineDetails["system_id"];
};

const EditInterface = ({
  close,
  linkId,
  nicId,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const nic = useSelector((state: RootState) =>
    machineSelectors.getInterfaceById(state, systemId, nicId, linkId)
  );
  const link = getLinkFromNic(nic, linkId);
  if (!machine || !("interfaces" in machine)) {
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
  } else {
    // Temporarily show a close button for all other types.
    form = <button onClick={close}>Cancel</button>;
  }
  return (
    <FormCard
      sidebar={false}
      stacked
      title={
        interfaceType ? `Edit ${INTERFACE_TYPE_DISPLAY[interfaceType]}` : null
      }
    >
      <InterfaceFormTable linkId={linkId} nicId={nicId} systemId={systemId} />
      {form}
    </FormCard>
  );
};

export default EditInterface;
