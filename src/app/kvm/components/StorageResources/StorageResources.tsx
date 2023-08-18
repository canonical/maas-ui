import classNames from "classnames";

import StorageCards from "./StorageCards";
import StorageMeter from "./StorageMeter";

import type { KVMStoragePoolResources } from "app/kvm/types";
import type { Pod } from "app/store/pod/types";
import { formatBytes } from "app/utils";

type Props = {
  allocated: number; // B
  defaultPoolId?: Pod["default_storage_pool"];
  free: number; // B
  other?: number; // B
  pools: KVMStoragePoolResources;
};

const StorageResources = ({
  allocated,
  defaultPoolId,
  free,
  other = 0,
  pools,
}: Props): JSX.Element => {
  const freeStorage = formatBytes(free, "B");
  const totalStorage = formatBytes(allocated + other + free, "B");
  const singlePool = Object.keys(pools).length === 1;
  const noPool = Object.keys(pools).length === 0;

  return (
    <div
      className={classNames("storage-resources", {
        "single-pool": singlePool,
      })}
      data-testid="lxd-cluster-storage"
    >
      <div
        className={classNames("storage-resources__header", {
          "storage-resources__header-no-pool": noPool,
        })}
      >
        <h4 className="p-text--x-small-capitalised">Storage</h4>
        {!singlePool && (
          <div data-testid="storage-summary">
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
      {!noPool && (
        <div className="storage-resources__content">
          {singlePool ? (
            <StorageMeter defaultPoolId={defaultPoolId} pools={pools} />
          ) : (
            <StorageCards defaultPoolId={defaultPoolId} pools={pools} />
          )}
        </div>
      )}
    </div>
  );
};

export default StorageResources;
