import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import EditPhysicalForm from "../EditPhysicalForm";
import InterfaceFormTable from "../InterfaceFormTable";

import FormCard from "app/base/components/FormCard";
import machineSelectors from "app/store/machine/selectors";
import type {
  MachineDetails,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
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

  if (!machine || !("interfaces" in machine)) {
    return <Spinner text="Loading..." />;
  }
  return (
    <FormCard sidebar={false} stacked title="Edit physical">
      <InterfaceFormTable linkId={linkId} nicId={nicId} systemId={systemId} />
      <EditPhysicalForm
        close={close}
        linkId={linkId}
        nicId={nicId}
        systemId={systemId}
      />
    </FormCard>
  );
};

export default EditInterface;
