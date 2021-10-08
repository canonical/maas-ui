import { useSelector } from "react-redux";

import StoragePopover from "./StoragePopover";

import Meter from "app/base/components/Meter";
import type { KVMResource } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod, PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = {
  defaultPoolID?: Pod["default_storage_pool"];
  podId?: Pod[PodMeta.PK];
  storage: KVMResource;
};

const StorageColumn = ({
  defaultPoolID,
  podId,
  storage,
}: Props): JSX.Element | null => {
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, Number(podId))
  );

  const { allocated_other, allocated_tracked, free } = storage;
  const totalInBytes = allocated_other + allocated_tracked + free;
  const totalStorage = formatBytes(totalInBytes, "B", { decimals: 1 });
  const allocatedStorage = formatBytes(allocated_tracked, "B", {
    convertTo: totalStorage.unit,
    decimals: 1,
  });

  const meter = (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          value: allocated_tracked,
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

  return sortedPools && defaultPoolID ? (
    <StoragePopover defaultPoolID={defaultPoolID} pools={sortedPools}>
      {meter}
    </StoragePopover>
  ) : (
    meter
  );
};

export default StorageColumn;
