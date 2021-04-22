import { useSelector } from "react-redux";

import CPUPopover from "./CPUPopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import podSelectors from "app/store/pod/selectors";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";

type Props = { id: number };

const CPUColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const { resources, cpu_over_commit_ratio } = pod;
    const { cores } = resources;
    const { allocated_other, allocated_tracked, free } = resourceWithOverCommit(
      cores,
      cpu_over_commit_ratio
    );
    const total = allocated_other + allocated_tracked + free;
    return (
      <CPUPopover cores={cores} overCommit={cpu_over_commit_ratio}>
        <Meter
          className="u-flex--column-align-end u-no-margin--bottom"
          data={[
            {
              color: COLOURS.LINK,
              value: allocated_tracked,
            },
            {
              color: COLOURS.POSITIVE,
              value: allocated_other,
            },
            {
              color: COLOURS.LINK_FADED,
              value: free > 0 ? free : 0,
            },
          ]}
          label={
            <small className="u-text--light">
              {`${allocated_tracked} of ${total} allocated`}
            </small>
          }
          labelClassName="u-align--right"
          max={total}
          segmented
          small
        />
      </CPUPopover>
    );
  }
  return null;
};

export default CPUColumn;
