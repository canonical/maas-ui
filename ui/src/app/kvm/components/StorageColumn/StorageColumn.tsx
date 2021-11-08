import StoragePopover from "./StoragePopover";

import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import type { KVMResource, KVMStoragePoolResources } from "app/kvm/types";

type Props = {
  pools: KVMStoragePoolResources;
  storage: KVMResource;
};

const StorageColumn = ({ pools, storage }: Props): JSX.Element | null => {
  return (
    <StoragePopover pools={pools}>
      <KVMResourceMeter
        allocated={storage.allocated_tracked}
        free={storage.free}
        other={storage.allocated_other}
        unit="B"
      />
    </StoragePopover>
  );
};

export default StorageColumn;
