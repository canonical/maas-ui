import TestResults from "../../TestResults";

import { HardwareType } from "app/base/enum";
import type { MachineSetHeaderContent } from "app/machines/types";
import type { MachineDetails } from "app/store/machine/types";

type Props = {
  machine: MachineDetails;
  setHeaderContent: MachineSetHeaderContent;
};

const MemoryCard = ({ machine, setHeaderContent }: Props): JSX.Element => (
  <>
    <div className="overview-card__memory">
      <strong className="p-muted-heading">Memory</strong>
      <h4>{machine.memory ? machine.memory + " GiB" : "Unknown"}</h4>
    </div>

    <TestResults
      machine={machine}
      hardwareType={HardwareType.Memory}
      setHeaderContent={setHeaderContent}
    />
  </>
);

export default MemoryCard;
