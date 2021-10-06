import PodMeter from "app/kvm/components/PodMeter";
import type { PodStoragePool } from "app/store/pod/types";
import { formatBytes } from "app/utils";

type Props = {
  pools: PodStoragePool[];
};

const StorageMeters = ({ pools }: Props): JSX.Element | null => {
  return (
    <div className="storage-meters">
      {pools.map((pool) => {
        const total = formatBytes(pool.total, "B");
        const allocated = formatBytes(pool.used, "B", {
          convertTo: total.unit,
        });
        const free = formatBytes(pool.total - pool.used, "B", {
          convertTo: total.unit,
        });

        return (
          <div className="storage-meter" key={pool.id}>
            <div className="storage-meter__name">{pool.name}</div>
            <PodMeter
              allocated={allocated.value}
              className="storage-meter__meter"
              free={free.value}
              inverted
              unit={total.unit}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StorageMeters;
