import { useSelector } from "react-redux";

import StoragePopover from "./StoragePopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
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
  const total =
    storage.allocated_other + storage.allocated_tracked + storage.free;
  const formattedTotal = formatBytes(total, "B", { decimals: 1 });
  const formattedAllocated = formatBytes(storage.allocated_tracked, "B", {
    convertTo: formattedTotal.unit,
    decimals: 1,
  });

  const meter = (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          color: COLOURS.LINK,
          value: storage.allocated_tracked,
        },
        {
          color: COLOURS.POSITIVE,
          value: storage.allocated_other,
        },
        {
          color: COLOURS.LINK_FADED,
          value: storage.free,
        },
      ]}
      label={
        <small className="u-text--light">
          {`${formattedAllocated.value} of ${formattedTotal.value}${formattedTotal.unit} allocated`}
        </small>
      }
      labelClassName="u-align--right"
      max={total}
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
