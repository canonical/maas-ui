import React from "react";
import { useSelector } from "react-redux";

import { formatBytes } from "app/utils";
import { pod as podSelectors } from "app/base/selectors";
import { RootState } from "app/base/types";
import Meter from "app/base/components/Meter";

type Props = { id: number };

const StorageColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const usedStorage = formatBytes(pod.used.local_storage, "B");

  return (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          key: `${pod.name}-storage-meter`,
          label: `${usedStorage.value} ${usedStorage.unit}`,
          value: pod.used.local_storage,
        },
      ]}
      labelsClassName="u-align--right"
      max={pod.total.local_storage}
      small
    />
  );
};

export default StorageColumn;
