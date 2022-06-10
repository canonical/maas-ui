import { Card } from "@canonical/react-components";

import ControllerStatusCard from "./ControllerStatusCard";
import CpuCard from "./CpuCard";
import DetailsCard from "./DetailsCard";
import MachineStatusCard from "./MachineStatusCard";
import MemoryCard from "./MemoryCard";
import StorageCard from "./StorageCard";

import type { MachineSetHeaderContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  node: ControllerDetails | MachineDetails;
  setHeaderContent?: MachineSetHeaderContent;
};

const OverviewCard = ({ node, setHeaderContent }: Props): JSX.Element => {
  const isMachine = nodeIsMachine(node);
  return (
    <Card className="u-no-padding">
      <div className="overview-card">
        {isMachine ? (
          <MachineStatusCard machine={node} />
        ) : (
          <ControllerStatusCard controller={node} />
        )}
        <CpuCard node={node} setHeaderContent={setHeaderContent} />
        <MemoryCard node={node} setHeaderContent={setHeaderContent} />
        <StorageCard node={node} setHeaderContent={setHeaderContent} />
        <DetailsCard node={node} />
      </div>
    </Card>
  );
};

export default OverviewCard;
