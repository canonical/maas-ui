import PodMeter from "app/kvm/components/PodMeter";
import StoragePopover from "app/kvm/components/StorageColumn/StoragePopover";
import type { KVMStoragePoolResources } from "app/kvm/types";
import { formatBytes } from "app/utils";

type Props = {
  pools: KVMStoragePoolResources;
};

const StorageMeter = ({ pools }: Props): JSX.Element | null => {
  const poolsArray = Object.entries(pools);
  if (poolsArray.length !== 1) {
    return null;
  }
  const [, pool] = poolsArray[0];
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
    <div className="u-width--full">
      <StoragePopover pools={pools}>
        <PodMeter
          allocated={allocated.value}
          className="storage-meter__meter"
          free={free.value}
          unit={total.unit}
        />
      </StoragePopover>
    </div>
  );
};

export default StorageMeter;
