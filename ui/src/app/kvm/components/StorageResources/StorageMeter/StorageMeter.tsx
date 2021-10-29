import PodMeter from "app/kvm/components/PodMeter";
import StoragePopover from "app/kvm/components/StorageColumn/StoragePopover";
import type { PodStoragePool } from "app/store/pod/types";
import { formatBytes } from "app/utils";

type Props = {
  pool: PodStoragePool;
};

const StorageMeter = ({ pool }: Props): JSX.Element | null => {
  const total = formatBytes(pool.total, "B");
  const allocated = formatBytes(pool.used, "B", {
    convertTo: total.unit,
  });
  const free = formatBytes(pool.total - pool.used, "B", {
    convertTo: total.unit,
  });

  return (
    <div className="u-width--full">
      <StoragePopover pools={[pool]}>
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
