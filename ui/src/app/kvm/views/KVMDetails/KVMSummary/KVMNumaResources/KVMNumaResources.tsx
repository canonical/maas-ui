import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useState } from "react";

import type { TSFixMe } from "app/base/types";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";

export const TRUNCATION_POINT = 3;

type Props = { numaNodes: TSFixMe[] };

const KVMNumaResources = ({ numaNodes }: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const canBeTruncated = numaNodes.length > TRUNCATION_POINT;
  const shownNumaNodes =
    canBeTruncated && !expanded
      ? numaNodes.slice(0, TRUNCATION_POINT)
      : numaNodes;

  return (
    <>
      <div className="numa-resources-grid">
        {shownNumaNodes.map((numa) => (
          <KVMResourcesCard
            cores={numa.cores}
            key={numa.index}
            nics={numa.nics}
            ram={numa.ram}
            title={`NUMA node ${numa.index}`}
            vfs={numa.vfs}
          />
        ))}
      </div>
      {canBeTruncated && (
        <div className="u-align--center">
          <Button
            appearance="base"
            data-test="show-more-numas"
            hasIcon
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span>Show less NUMA nodes</span>
                <i className="p-icon--contextual-menu u-mirror--y"></i>
              </>
            ) : (
              <>
                <span>
                  {pluralize(
                    "more NUMA node",
                    numaNodes.length - TRUNCATION_POINT,
                    true
                  )}
                </span>
                <i className="p-icon--contextual-menu"></i>
              </>
            )}
          </Button>
          <hr />
        </div>
      )}
    </>
  );
};

export default KVMNumaResources;
