import TestResults from "app/base/components/node/TestResults";
import { HardwareType } from "app/base/enum";
import type { MachineSetSidePanelContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
  setSidePanelContent?: MachineSetSidePanelContent;
};

const MemoryCard = ({ node, setSidePanelContent }: Props): JSX.Element => (
  <>
    <div className="overview-card__memory">
      <strong className="p-muted-heading u-flex--between u-no-margin--bottom">
        Memory
      </strong>
      <h4 className="u-no-margin--bottom">
        {node.memory ? node.memory + " GiB" : "Unknown"}
      </h4>
    </div>
    {nodeIsMachine(node) && setSidePanelContent ? (
      <TestResults
        hardwareType={HardwareType.Memory}
        machine={node}
        setSidePanelContent={setSidePanelContent}
      />
    ) : (
      <div className="overview-card__memory-tests" />
    )}
  </>
);

export default MemoryCard;
