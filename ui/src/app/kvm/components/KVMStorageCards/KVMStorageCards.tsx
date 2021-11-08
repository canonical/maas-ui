import { useState } from "react";

import { Button, Card } from "@canonical/react-components";
import pluralize from "pluralize";

import { useSendAnalytics } from "app/base/hooks";
import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import type {
  KVMStoragePoolResource,
  KVMStoragePoolResources,
} from "app/kvm/types";
import { calcFreePoolStorage } from "app/kvm/utils";

export const TRUNCATION_POINT = 3;

type Props = {
  pools: KVMStoragePoolResources;
};

const KVMStorageCards = ({ pools }: Props): JSX.Element | null => {
  const [expanded, setExpanded] = useState(false);
  const sendAnalytics = useSendAnalytics();

  const poolsArray = Object.entries<KVMStoragePoolResource>(pools);
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
          return (
            <Card key={`storage-card-${name}`}>
              <h5>
                <span data-test="pool-name">{name}</span>
                <br />
                <span
                  className="p-text--paragraph u-text--light"
                  title={pool.path}
                >
                  {pool.path}
                </span>
              </h5>
              <hr />
              <div className="kvm-storage-cards__meter">
                <div>
                  <p className="p-heading--small u-text--light">Type</p>
                  <div>{pool.backend}</div>
                </div>
                <KVMResourceMeter
                  allocated={pool.allocated_tracked}
                  detailed
                  free={calcFreePoolStorage(pool)}
                  other={pool.allocated_other}
                  unit="B"
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
