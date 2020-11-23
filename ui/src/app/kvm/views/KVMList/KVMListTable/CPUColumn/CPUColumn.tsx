import React from "react";

import { useSelector } from "react-redux";

import CPUPopover from "./CPUPopover";

import Meter from "app/base/components/Meter";
import podSelectors from "app/store/pod/selectors";

import type { RootState } from "app/store/root/types";

type Props = { id: number };

const CPUColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const availableCores = pod.total.cores * pod.cpu_over_commit_ratio;
    return (
      <CPUPopover
        allocated={pod.used.cores}
        physical={pod.total.cores}
        overcommit={pod.cpu_over_commit_ratio}
      >
        <Meter
          className="u-flex--column-align-end u-no-margin--bottom"
          data={[
            {
              value: pod.used.cores,
            },
          ]}
          label={
            <small className="u-text--light">
              {`${pod.used.cores} of ${availableCores} allocated`}
            </small>
          }
          labelClassName="u-align--right"
          max={availableCores}
          segmented
          small
        />
      </CPUPopover>
    );
  }
  return null;
};

export default CPUColumn;
