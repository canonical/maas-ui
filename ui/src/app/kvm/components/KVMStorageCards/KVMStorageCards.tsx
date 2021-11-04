import { useState } from "react";

import { Button, Card } from "@canonical/react-components";
import pluralize from "pluralize";

import { useSendAnalytics } from "app/base/hooks";
import PodMeter from "app/kvm/components/PodMeter";
import type { KVMStoragePoolResources } from "app/kvm/types";
import { formatBytes } from "app/utils";

export const TRUNCATION_POINT = 3;

type Props = {
  pools: KVMStoragePoolResources;
};

const KVMStorageCards = ({ pools }: Props): JSX.Element | null => {
  const [expanded, setExpanded] = useState(false);
  const sendAnalytics = useSendAnalytics();

  const poolsArray = Object.entries(pools);
  const canBeTruncated = poolsArray.length > TRUNCATION_POINT;
  const shownPools =
    canBeTruncated && !expanded
      ? poolsArray.slice(0, TRUNCATION_POINT)
      : poolsArray;

  return (
    <>
      <h4 className="u-sv1">Storage</h4>
      <div className="kvm-storage-cards">
        {shownPools.map(([name, pool]) => {
          const total = formatBytes(pool.total, "B");
          const allocated = formatBytes(
            pool.allocated_tracked + pool.allocated_other,
            "B",
            {
              convertTo: total.unit,
            }
          );
          const free = formatBytes(
            pool.total - pool.allocated_tracked - pool.allocated_other,
            "B",
            {
              convertTo: total.unit,
            }
          );

          return (
            <Card className="u-no-padding--bottom" key={`storage-card-${name}`}>
              <h5>
                <span data-test="pool-name">{name}</span>
                <br />
                <span className="p-text--paragraph u-text--light">
                  {pool.path}
                </span>
              </h5>
              <hr />
              <div className="kvm-storage-cards__meter">
                <div>
                  <p className="p-heading--small u-text--light">Type</p>
                  <div>{pool.backend}</div>
                </div>
                <PodMeter
                  allocated={allocated.value}
                  free={free.value}
                  unit={total.unit}
                />
              </div>
            </Card>
          );
        })}
      </div>
      {canBeTruncated && (
        <div className="u-align--center">
          <Button
            appearance="base"
            data-test="show-more-pools"
            hasIcon
            onClick={() => {
              setExpanded(!expanded);
              sendAnalytics(
                "KVM details",
                "Toggle expanded storage pools",
                expanded ? "Show less storage pools" : "Show more storage pools"
              );
            }}
          >
            {expanded ? (
              <>
                <span>Show less storage pools</span>
                <i className="p-icon--contextual-menu u-mirror--y"></i>
              </>
            ) : (
              <>
                <span>
                  {pluralize(
                    "more storage pool",
                    poolsArray.length - TRUNCATION_POINT,
                    true
                  )}
                </span>
                <i className="p-icon--contextual-menu"></i>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default KVMStorageCards;
