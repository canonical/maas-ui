import React from "react";
import { useSelector } from "react-redux";

import { formatBytes } from "app/utils";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import Meter from "app/base/components/Meter";
import StoragePopover from "./StoragePopover";

type Props = { id: number };

const StorageColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const availableStorage = formatBytes(pod.total.local_storage, "B");
    const allocatedStorage = formatBytes(pod.used.local_storage, "B", {
      convertTo: availableStorage.unit,
    });

    return (
      <StoragePopover
        defaultPoolID={pod.default_storage_pool}
        pools={pod.storage_pools}
      >
        <Meter
          className="u-no-margin--bottom"
          data={[
            {
              key: `${pod.name}-storage-meter`,
              value: pod.used.local_storage,
            },
          ]}
          label={
            <small className="u-text--light">
              {`${allocatedStorage.value} of ${availableStorage.value} ${availableStorage.unit} allocated`}
            </small>
          }
          labelClassName="u-align--right"
          max={pod.total.local_storage}
          small
        />
      </StoragePopover>
    );
  }
  return null;
};

export default StorageColumn;
