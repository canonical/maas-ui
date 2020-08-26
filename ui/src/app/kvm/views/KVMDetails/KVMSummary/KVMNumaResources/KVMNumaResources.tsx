import { Button } from "@canonical/react-components";
import classNames from "classnames";
import pluralize from "pluralize";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import type { TSFixMe } from "app/base/types";
import { sendAnalyticsEvent } from "analytics";
import configSelectors from "app/store/config/selectors";
import KVMResourcesCard from "app/kvm/components/KVMResourcesCard";

export const TRUNCATION_POINT = 4;

type Props = { numaNodes: TSFixMe[] };

const KVMNumaResources = ({ numaNodes }: Props): JSX.Element => {
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const [expanded, setExpanded] = useState(false);
  const canBeTruncated = numaNodes.length > TRUNCATION_POINT;
  const shownNumaNodes =
    canBeTruncated && !expanded
      ? numaNodes.slice(0, TRUNCATION_POINT)
      : numaNodes;
  const showWideCards = numaNodes.length <= 2;

  return (
    <>
      <div
        className={classNames("numa-resources-grid", {
          "is-wide": showWideCards,
        })}
      >
        {shownNumaNodes.map((numa) => (
          <KVMResourcesCard
            className={showWideCards ? "kvm-resources-card--wide" : undefined}
            cores={numa.cores}
            key={numa.index}
            nics={numa.nics}
            ram={numa.ram}
            title={`NUMA node ${numa.index}`}
            vfs={numa.vfs}
            vms={numa.vms}
          />
        ))}
      </div>
      {canBeTruncated && (
        <div className="u-align--center">
          <Button
            appearance="base"
            data-test="show-more-numas"
            hasIcon
            onClick={() => {
              setExpanded(!expanded);
              if (analyticsEnabled) {
                sendAnalyticsEvent(
                  "KVM details",
                  "Toggle expanded NUMA nodes",
                  expanded ? "Show less NUMA nodes" : "Show more NUMA nodes"
                );
              }
            }}
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
