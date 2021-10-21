import { useSelector } from "react-redux";

import StoragePopover from "./StoragePopover";

import Meter from "app/base/components/Meter";
import type { KVMResource } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { VMCluster, VMClusterMeta } from "app/store/vmcluster/types";
import { formatBytes } from "app/utils";

type Props = {
  clusterId?: VMCluster[VMClusterMeta.PK];
  defaultPoolID?: Pod["default_storage_pool"];
  podId?: Pod[PodMeta.PK];
  storage: KVMResource;
};

const StorageColumn = ({
  clusterId,
  defaultPoolID,
  podId,
  storage,
}: Props): JSX.Element | null => {
  const sortedClusterPools = useSelector((state: RootState) =>
    podSelectors.getSortedClusterPools(state, clusterId ?? null)
  );
  const sortedPodPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, podId ?? null)
  );
  const pools = clusterId !== undefined ? sortedClusterPools : sortedPodPools;

  let totalInBytes = 0;
  let allocated = 0;
  if ("allocated_other" in storage) {
    totalInBytes =
      storage.allocated_other + storage.allocated_tracked + storage.free;
    allocated = storage.allocated_tracked;
  } else if ("total" in storage) {
    totalInBytes = storage.total;
    allocated = totalInBytes - storage.free;
  }

  const totalStorage = formatBytes(totalInBytes, "B", { decimals: 1 });
  const allocatedStorage = formatBytes(allocated, "B", {
    convertTo: totalStorage.unit,
    decimals: 1,
  });

  const meter = (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          value: allocated,
        },
      ]}
      label={
        <small className="u-text--light">
          {`${allocatedStorage.value} of ${totalStorage.value} ${totalStorage.unit} allocated`}
        </small>
      }
      labelClassName="u-align--right"
      max={totalInBytes}
      small
    />
  );

  return (
    <StoragePopover defaultPoolID={defaultPoolID} pools={pools}>
      {meter}
    </StoragePopover>
  );
};

export default StorageColumn;
