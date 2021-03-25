import { useState } from "react";

import { Button, Card } from "@canonical/react-components";
import pluralize from "pluralize";
import { useSelector } from "react-redux";

import { useSendAnalytics } from "app/base/hooks";
import PodMeter from "app/kvm/components/PodMeter";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

export const TRUNCATION_POINT = 3;

type Props = { id: Pod["id"] };

const PodStorage = ({ id }: Props): JSX.Element | null => {
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, Number(id))
  );
  const [expanded, setExpanded] = useState(false);
  const sendAnalytics = useSendAnalytics();

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
};

export default PodStorage;
