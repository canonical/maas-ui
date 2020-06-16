import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import Meter from "app/base/components/Meter";

const CPUColumn = ({ id }) => {
  const pod = useSelector((state) => podSelectors.getById(state, id));

  return (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          key: `${pod.name}-cpu-meter`,
          label: `${pod.total.cores}`,
          value: pod.used.cores,
        },
      ]}
      labelsClassName="u-align--right"
      max={pod.total.cores * pod.cpu_over_commit_ratio}
      small
    />
  );
};

export default CPUColumn;
