import { Tooltip } from "@canonical/react-components";

import type { Disk } from "app/store/types/node";

type Props = { disk: Disk };

const NumaNodes = ({ disk }: Props): JSX.Element => {
  let numaNodes: number[] = [];
  if ("numa_nodes" in disk && disk.numa_nodes !== undefined) {
    numaNodes = disk.numa_nodes;
  } else if ("numa_node" in disk && disk.numa_node !== undefined) {
    numaNodes = [disk.numa_node];
  }

  return (
    <>
      {numaNodes.length > 1 && (
        <Tooltip
          data-testid="numa-warning"
          message={
            "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
          }
        >
          <i className="p-icon--warning is-inline"></i>
        </Tooltip>
      )}
      <span data-testid="numa-nodes">{numaNodes.join(", ") || "—"}</span>
    </>
  );
};

export default NumaNodes;
