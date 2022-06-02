import pluralize from "pluralize";

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

// Get the subtext for the CPU card. Only nodes commissioned after
// MAAS 2.4 will have the CPU speed.
const getCPUSubtext = (node: Props["node"]) => {
  let text = "Unknown";

  if (node.cpu_count) {
    text = pluralize("core", node.cpu_count, true);
  }
  if (node.cpu_speed) {
    const speedText =
      node.cpu_speed > 1000
        ? `${node.cpu_speed / 1000} GHz`
        : `${node.cpu_speed} MHz`;
    text += `, ${speedText}`;
  }
  return text;
};

const CpuCard = ({ node, setHeaderContent }: Props): JSX.Element => (
  <>
    <div className="overview-card__cpu">
      <div className="u-flex--between">
        <strong className="p-muted-heading">CPU</strong>
        <span>{node.architecture}</span>
      </div>
      <h4 className="u-no-margin--bottom" data-testid="cpu-subtext">
        {getCPUSubtext(node)}
      </h4>
      <p className="p-text--muted">
        {node.metadata.cpu_model || "Unknown model"}
      </p>
    </div>
    {nodeIsMachine(node) && setHeaderContent ? (
      <TestResults
        machine={node}
        hardwareType={HardwareType.CPU}
        setHeaderContent={setHeaderContent}
      />
    ) : (
      <div className="overview-card__cpu-tests" />
    )}
  </>
);

export default CpuCard;
