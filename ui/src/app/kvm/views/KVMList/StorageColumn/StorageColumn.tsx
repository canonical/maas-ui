import { useSelector } from "react-redux";

import StoragePopover from "./StoragePopover";

import Meter from "app/base/components/Meter";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = { id: number };

const StorageColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const sortedPools = useSelector((state: RootState) =>
    podSelectors.getSortedPools(state, Number(id))
  );

  if (pod) {
    const { allocated_other, allocated_tracked, free } = pod.resources.storage;
    const totalInBytes = allocated_other + allocated_tracked + free;
    const totalStorage = formatBytes(totalInBytes, "B", { decimals: 1 });
    const allocatedStorage = formatBytes(allocated_tracked, "B", {
      convertTo: totalStorage.unit,
      decimals: 1,
    });

    return (
      <StoragePopover
        defaultPoolID={pod.default_storage_pool}
        pools={sortedPools}
      >
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
      </StoragePopover>
    );
  }
  return null;
};

export default StorageColumn;
