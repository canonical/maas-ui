import TestResults from "app/base/components/node/TestResults";
import { HardwareType } from "app/base/enum";
import type { MachineSetHeaderContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
  setHeaderContent?: MachineSetHeaderContent;
};

const MemoryCard = ({ node, setHeaderContent }: Props): JSX.Element => (
  <>
    <div className="overview-card__memory">
      <strong className="p-muted-heading">Memory</strong>
      <h4>{node.memory ? node.memory + " GiB" : "Unknown"}</h4>
    </div>
    {nodeIsMachine(node) && setHeaderContent ? (
      <TestResults
        hardwareType={HardwareType.Memory}
        machine={node}
        setHeaderContent={setHeaderContent}
      />
    ) : (
      <div className="overview-card__memory-tests" />
    )}
  </>
);

export default MemoryCard;
