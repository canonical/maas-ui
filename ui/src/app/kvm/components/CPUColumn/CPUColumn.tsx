import CPUPopover from "./CPUPopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { KVMResource } from "app/kvm/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  cores: KVMResource;
  overCommit?: number;
};

const CPUColumn = ({ cores, overCommit }: Props): JSX.Element | null => {
  let total = 0;
  let allocated = 0;
  let other = 0;
  let free = 0;
  if (overCommit && "allocated_other" in cores) {
    const resources = resourceWithOverCommit(cores, overCommit);
    total =
      resources.allocated_other + resources.allocated_tracked + resources.free;
    allocated = resources.allocated_tracked;
    other = resources.allocated_other;
    free = resources.free;
  } else if ("total" in cores) {
    total = cores.total;
    allocated = cores.total - cores.free;
    free = cores.free;
  }
  return (
    <CPUPopover cores={cores} overCommit={overCommit}>
      <Meter
        className="u-flex--column-align-end u-no-margin--bottom"
        data={[
          {
            color: COLOURS.LINK,
            value: allocated,
          },
          {
            color: COLOURS.POSITIVE,
            value: other,
          },
          {
            color: COLOURS.LINK_FADED,
            value: free > 0 ? free : 0,
          },
        ]}
        label={
          <small className="u-text--light">
            {`${allocated} of ${total} allocated`}
          </small>
        }
        labelClassName="u-align--right"
        max={total}
        segmented
        small
      />
    </CPUPopover>
  );
};

export default CPUColumn;
