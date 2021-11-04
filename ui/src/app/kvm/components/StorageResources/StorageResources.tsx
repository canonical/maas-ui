import classNames from "classnames";

import StorageCards from "./StorageCards";
import StorageMeter from "./StorageMeter";

import type { KVMStoragePoolResources } from "app/kvm/types";
import { formatBytes } from "app/utils";

type Props = {
  storage: {
    allocated: number;
    free: number;
    pools: KVMStoragePoolResources;
  };
};

const StorageResources = ({ storage }: Props): JSX.Element | null => {
  const freeStorage = formatBytes(storage.free, "B");
  const totalStorage = formatBytes(storage.allocated + storage.free, "B");
  const singlePool = Object.keys(storage.pools).length === 1;

  return (
    <div
      className={classNames("storage-resources", { "single-pool": singlePool })}
    >
      <div className="storage-resources__header">
        <h4 className="p-text--x-small-capitalised u-sv1">Storage</h4>
        {!singlePool && (
          <div data-test="storage-summary">
            <div className="u-nudge-left">
              <div className="p-text--x-small-capitalised u-text--muted u-no-margin--bottom">
                Total
              </div>
              <div className="u-align--right u-nudge-right u-sv1">
                {totalStorage.value}
                {totalStorage.unit}
              </div>
              <hr />
            </div>
            <div className="u-nudge-left">
              <div className="p-text--x-small-capitalised u-text--muted u-no-margin--bottom">
                Free
              </div>
              <div className="u-align--right u-nudge-right">
                {freeStorage.value}
                {freeStorage.unit}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="storage-resources__content">
        {singlePool ? (
          <StorageMeter pools={storage.pools} />
        ) : (
          <StorageCards pools={storage.pools} />
        )}
      </div>
    </div>
  );
};

export default StorageResources;
