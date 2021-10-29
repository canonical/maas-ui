import classNames from "classnames";

import StorageCards from "./StorageCards";
import StorageMeter from "./StorageMeter";

import type { PodStoragePool } from "app/store/pod/types";
import { formatBytes } from "app/utils";

type Props = {
  storage: {
    allocated: number;
    free: number;
    pools: PodStoragePool[];
  };
};

const StorageResources = ({ storage }: Props): JSX.Element | null => {
  const freeStorage = formatBytes(storage.free, "B");
  const totalStorage = formatBytes(storage.allocated + storage.free, "B");
  const singlePool = storage.pools.length === 1;

  return (
    <div
      className={classNames("storage-resources", { "single-pool": singlePool })}
    >
      <h4 className="storage-resources__header p-heading--small u-sv1">
        Storage
      </h4>
      <div className="storage-resources__content">
        {singlePool ? (
          <StorageMeter pool={storage.pools[0]} />
        ) : (
          <>
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
              <StorageCards pools={storage.pools} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StorageResources;
