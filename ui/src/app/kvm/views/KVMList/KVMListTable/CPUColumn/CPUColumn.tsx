import React from "react";
import { useSelector } from "react-redux";

import { pod as podSelectors } from "app/base/selectors";
import type { RootState } from "app/store/root/types";
import CPUPopover from "./CPUPopover";
import Meter from "app/base/components/Meter";

type Props = { id: number };

const CPUColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    return (
      <CPUPopover
        assigned={pod.used.cores}
        physical={pod.total.cores}
        overcommit={pod.cpu_over_commit_ratio}
      >
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
      </CPUPopover>
    );
  }
  return null;
};

export default CPUColumn;
