import { useSelector } from "react-redux";

import StorageCards from "./StorageCards";
import StorageMeters from "./StorageMeters";

import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = { id: Pod["id"] };

const StorageResources = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, Number(id))
  );
  const showCards = sortedPools.length >= 3;

  if (!pod) {
    return null;
  }

  const { allocated_other, allocated_tracked, free } = pod.resources.storage;
  const freeStorage = formatBytes(free, "B");
  const totalStorage = formatBytes(
    allocated_other + allocated_tracked + free,
    "B"
  );

  return (
    <div className="storage-resources">
      <h4 className="storage-resources__header p-heading--small u-sv1">
        Storage
      </h4>
      <div className="storage-resources__content">
        <div className="storage-resources__usage">
          <div className="u-nudge-left">
            <div className="p-heading--small u-text--muted">Total</div>
            <div className="u-nudge-right u-sv1">
              {totalStorage.value}
              {totalStorage.unit}
            </div>
          </div>
          <div className="u-nudge-left">
            <div className="p-heading--small u-text--muted">Free</div>
            <div className="u-nudge-right u-sv1">
              {freeStorage.value}
              {freeStorage.unit}
            </div>
          </div>
        </div>
        <div className="storage-resources__pools">
          {showCards ? (
            <StorageCards pools={sortedPools} />
          ) : (
            <StorageMeters pools={sortedPools} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageResources;
