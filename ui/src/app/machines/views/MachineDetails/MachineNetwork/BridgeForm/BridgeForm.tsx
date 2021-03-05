import InterfaceFormTable from "../InterfaceFormTable";
import type { Selected } from "../NetworkTable/types";

import FormCard from "app/base/components/FormCard";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  close: () => void;
  selected: Selected[];
  systemId: MachineDetails["system_id"];
};

const BridgeForm = ({
  close,
  selected,
  systemId,
}: Props): JSX.Element | null => {
  // A bridge can only be created with one interface.
  if (selected.length !== 1) {
    return null;
  }
  const [{ linkId, nicId }] = selected;
  return (
    <FormCard sidebar={false} stacked title="Create bridge">
      <InterfaceFormTable
        isPrimary
        linkId={linkId}
        nicId={nicId}
        systemId={systemId}
      />
      <button onClick={close}>Cancel</button>
    </FormCard>
  );
};

export default BridgeForm;
