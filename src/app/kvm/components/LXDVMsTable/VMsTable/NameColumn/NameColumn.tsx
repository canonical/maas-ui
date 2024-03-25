import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DoubleRow from "@/app/base/components/DoubleRow";
import urls from "@/app/base/urls";
import MachineCheckbox from "@/app/machines/views/MachineList/MachineListTable/MachineCheckbox";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  callId?: string | null;
  systemId: Machine["system_id"];
};

const NameColumn = ({ callId, systemId }: Props): JSX.Element => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (!machine) {
    return <Spinner />;
  }
  return (
    <DoubleRow
      data-testid="name-col"
      primary={
        <MachineCheckbox
          callId={callId}
          label={
            <Link to={urls.machines.machine.index({ id: machine.system_id })}>
              <strong>{machine.hostname}</strong>
            </Link>
          }
          systemId={systemId}
        />
      }
      primaryTitle={machine.hostname}
    />
  );
};

export default NameColumn;
