import TestResults from "../../TestResults";

import { HardwareType } from "app/base/enum";
import type { MachineSetSelectedAction } from "app/machines/views/types";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails;
  setSelectedAction: MachineSetSelectedAction;
};

const MemoryCard = ({ machine, setSelectedAction }: Props): JSX.Element => (
  <>
    <div className="overview-card__memory">
      <strong className="p-muted-heading">Memory</strong>
      <h4>{machine.memory ? machine.memory + " GiB" : "Unknown"}</h4>
    </div>

    <TestResults
      machine={machine}
      hardwareType={HardwareType.Memory}
      setSelectedAction={setSelectedAction}
    />
  </>
);

export default MemoryCard;
