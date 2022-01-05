import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import MachineForm from "./MachineForm";
import PowerForm from "./PowerForm";

import { useWindowTitle } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import machineSelectors from "app/store/machine/selectors";
import { MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const MachineConfiguration = (): JSX.Element => {
  const id = useGetURLId(MachineMeta.PK);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} configuration`);

  if (!machine) {
    return <Spinner text="Loading" />;
  }

  return (
    <>
      <Strip shallow>
        <MachineForm systemId={machine.system_id} />
      </Strip>
      <Strip shallow>
        <PowerForm systemId={machine.system_id} />
      </Strip>
    </>
  );
};

export default MachineConfiguration;
