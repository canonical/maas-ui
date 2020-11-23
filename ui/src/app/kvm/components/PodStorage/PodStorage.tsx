import { Button, Card, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useSendAnalytics } from "app/base/hooks";
import PodMeter from "app/kvm/components/PodMeter";
import podSelectors from "app/store/pod/selectors";
import { formatBytes } from "app/utils";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

export const TRUNCATION_POINT = 3;

type Props = { id: Pod["id"] };

const PodStorage = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [expanded, setExpanded] = useState(false);
  const sendAnalytics = useSendAnalytics();

  if (!!pod) {
    const sortedPools = [...pod.storage_pools].sort((a, b) => {
      if (a.id === pod.default_storage_pool || b.id > a.id) {
        return -1;
      }
      if (b.id === pod.default_storage_pool || a.id > b.id) {
        return 1;
      }
      return 0;
    });
    const canBeTruncated = sortedPools.length > TRUNCATION_POINT;
    const shownPools =
      canBeTruncated && !expanded
        ? sortedPools.slice(0, TRUNCATION_POINT)
        : sortedPools;

    return (
      <>
        <h4 className="u-sv1">
          Storage&nbsp;
          <span className="p-text--paragraph u-text--light">
            (Sorted by id, default first)
          </span>
        </h4>
        <div className="pod-storage-grid">
          {shownPools.map((pool) => {
            const total = formatBytes(pool.total, "B");
            const allocated = formatBytes(pool.used, "B", {
              convertTo: total.unit,
            });
            const free = formatBytes(pool.total - pool.used, "B", {
              convertTo: total.unit,
            });

            return (
              <Card className="u-no-padding--bottom" key={pool.id}>
                <h5>
                  <span data-test="pool-name">{pool.name}</span>
                  <br />
                  <span className="p-text--paragraph u-text--light">
                    {pool.path}
                  </span>
                </h5>
                <hr />
                <div className="pod-storage-meter-grid">
                  <div>
                    <p className="p-heading--small u-text--light">Type</p>
                    <div>{pool.type}</div>
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
                  `${pod.type === "rsd" ? "RSD" : "KVM"} details`,
                  "Toggle expanded storage pools",
                  expanded
                    ? "Show less storage pools"
                    : "Show more storage pools"
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
                      sortedPools.length - TRUNCATION_POINT,
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
  }
  return <Spinner text="Loading" />;
};

export default PodStorage;
