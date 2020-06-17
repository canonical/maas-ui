import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import { RootState } from "app/base/types";
import Meter from "app/base/components/Meter";

type Props = { id: number };

const CPUColumn = ({ id }: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

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
