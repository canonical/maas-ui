import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import StoragePopover from "app/kvm/components/StorageColumn/StoragePopover";
import type {
  KVMStoragePoolResource,
  KVMStoragePoolResources,
} from "app/kvm/types";
import { calcFreePoolStorage } from "app/kvm/utils";

type Props = {
  pools: KVMStoragePoolResources;
};

const StorageMeter = ({ pools }: Props): JSX.Element | null => {
  const poolsArray = Object.entries<KVMStoragePoolResource>(pools);
  if (poolsArray.length !== 1) {
    return null;
  }
  const [, pool] = poolsArray[0];

  return (
    <div className="u-width--full">
      <StoragePopover pools={pools}>
        <KVMResourceMeter
          allocated={pool.allocated_tracked}
          detailed
          free={calcFreePoolStorage(pool)}
          other={pool.allocated_other}
          unit="B"
        />
      </StoragePopover>
    </div>
  );
};

export default StorageMeter;
