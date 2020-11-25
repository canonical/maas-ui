import React from "react";

import { useSelector } from "react-redux";

import RAMPopover from "./RAMPopover";

import Meter from "app/base/components/Meter";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = { id: number };

const RAMColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const availableMemory = formatBytes(
      pod.total.memory * pod.memory_over_commit_ratio,
      "MiB",
      { binary: true }
    );
    const assignedMemory = formatBytes(pod.used.memory, "MiB", {
      binary: true,
      convertTo: availableMemory.unit,
    });

    return (
      <RAMPopover
        allocated={pod.used.memory}
        overcommit={pod.memory_over_commit_ratio}
        physical={pod.total.memory}
      >
        <Meter
          className="u-no-margin--bottom"
          data={[
            {
              value: pod.used.memory,
            },
          ]}
          label={
            <small className="u-text--light">
              {`${assignedMemory.value} of ${availableMemory.value} ${availableMemory.unit} allocated`}
            </small>
          }
          labelClassName="u-align--right"
          max={pod.total.memory * pod.memory_over_commit_ratio}
          small
        />
      </RAMPopover>
    );
  }
  return null;
};

export default RAMColumn;
