import { Card } from "@canonical/react-components";

import ControllerStatusCard from "./ControllerStatusCard";
import CpuCard from "./CpuCard";
import DetailsCard from "./DetailsCard";
import MachineStatusCard from "./MachineStatusCard";
import MemoryCard from "./MemoryCard";
import StorageCard from "./StorageCard";

import type { MachineSetSidePanelContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
  setSidePanelContent?: MachineSetSidePanelContent;
};

const OverviewCard = ({ node, setSidePanelContent }: Props): JSX.Element => {
  const isMachine = nodeIsMachine(node);
  return (
    <Card className="u-no-padding">
      <div className="overview-card">
        {isMachine ? (
          <MachineStatusCard machine={node} />
        ) : (
          <ControllerStatusCard controller={node} />
        )}
        <CpuCard node={node} setSidePanelContent={setSidePanelContent} />
        <MemoryCard node={node} setSidePanelContent={setSidePanelContent} />
        <StorageCard node={node} setSidePanelContent={setSidePanelContent} />
        <DetailsCard node={node} />
      </div>
    </Card>
  );
};

export default OverviewCard;
