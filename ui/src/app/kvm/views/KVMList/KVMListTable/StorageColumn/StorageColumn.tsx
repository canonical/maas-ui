import React from "react";
import { useSelector } from "react-redux";

import { formatBytes } from "app/utils";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import Meter from "app/base/components/Meter";

type Props = { id: number };

const StorageColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const availableStorage = formatBytes(pod.total.local_storage, "B");
    const assignedStorage = formatBytes(pod.used.local_storage, "B", {
      convertTo: availableStorage.unit,
    });

    return (
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
            {`${assignedStorage.value} of ${availableStorage.value} ${availableStorage.unit} assigned`}
          </small>
        }
        labelClassName="u-align--right"
        max={pod.total.local_storage}
        small
      />
    );
  }
  return null;
};

export default StorageColumn;
