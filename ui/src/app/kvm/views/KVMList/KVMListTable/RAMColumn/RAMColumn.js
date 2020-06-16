import React from "react";
import { useSelector } from "react-redux";

import { formatBytes } from "app/utils";
import { pod as podSelectors } from "app/base/selectors";
import Meter from "app/base/components/Meter";

const PoolColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));
  const usedMemory = formatBytes(pod.used.memory, "MiB", { binary: true });

  return (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          key: `${pod.name}-memory-meter`,
          label: `${usedMemory.value} ${usedMemory.unit}`,
          value: pod.used.memory,
        },
      ]}
      labelsClassName="u-align--right"
      max={pod.total.memory * pod.memory_over_commit_ratio}
      small
    />
  );
};

export default PoolColumn;
