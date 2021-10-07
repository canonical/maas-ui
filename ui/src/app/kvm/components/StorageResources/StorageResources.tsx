import StorageCards from "./StorageCards";

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
          <StorageCards pools={storage.pools} />
        </div>
      </div>
    </div>
  );
};

export default StorageResources;
