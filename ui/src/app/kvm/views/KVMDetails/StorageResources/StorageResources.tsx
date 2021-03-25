import { useSelector } from "react-redux";

import PodMeter from "app/kvm/components/PodMeter";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

export const TRUNCATION_POINT = 3;

type Props = { id: Pod["id"] };

const StorageResources = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, id)
  );

  if (!pod) {
    return null;
  }

  const total = formatBytes(pod.total.local_storage, "B");
  const free = formatBytes(
    pod.total.local_storage - pod.used.local_storage,
    "B"
  );
  return (
    <div className="storage-resources">
      <div className="storage-resources__stats">
        <h4 className="p-heading--small u-sv1">Storage</h4>
        <div className="storage-resources__usage">
          <div className="u-nudge-left">
            <div className="p-heading--small u-text--muted">Total</div>
            <div className="u-nudge-right u-sv1">
              {total.value}
              {total.unit}
            </div>
          </div>
          <div className="u-nudge-left">
            <div className="p-heading--small u-text--muted">Free</div>
            <div className="u-nudge-right u-sv1">
              {free.value}
              {free.unit}
            </div>
          </div>
        </div>
      </div>
      <div className="storage-resources__pools-container">
        {sortedPools.map((pool) => {
          const total = formatBytes(pool.total, "B");
          const allocated = formatBytes(pool.used, "B", {
            convertTo: total.unit,
          });
          const free = formatBytes(pool.total - pool.used, "B", {
            convertTo: total.unit,
          });

          return (
            <div className="storage-resources__pool" key={pool.id}>
              <div className="storage-resources__pool-name">{pod.name}</div>
              <PodMeter
                allocated={allocated.value}
                className="storage-resources__pool-meter"
                free={free.value}
                inverted
                unit={total.unit}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorageResources;
