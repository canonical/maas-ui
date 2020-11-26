import React from "react";

import { Tooltip } from "@canonical/react-components";

import type { NormalisedStorageDevice } from "../types";

type Props = { numaNodes: NormalisedStorageDevice["numaNodes"] };

const NumaNodes = ({ numaNodes }: Props): JSX.Element => {
  return (
    <>
      {numaNodes.length > 1 && (
        <Tooltip
          data-test="numa-warning"
          message={
            "This volume is spread over multiple NUMA nodes which may cause suboptimal performance."
          }
        >
          <i className="p-icon--warning is-inline"></i>
        </Tooltip>
      )}
      <span data-test="numa-nodes">{numaNodes.join(", ")}</span>
    </>
  );
};

export default NumaNodes;
