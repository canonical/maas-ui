import RAMPopover from "./RAMPopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { KVMResource } from "app/kvm/types";
import { resourceWithOverCommit } from "app/store/pod/utils";
import { formatBytes } from "app/utils";

type Props = {
  memory: {
    hugepages: KVMResource;
    general: KVMResource;
  };
  overCommit: number;
};

const RAMColumn = ({ memory, overCommit }: Props): JSX.Element | null => {
  const { general, hugepages } = memory;
  const generalOver = resourceWithOverCommit(general, overCommit);
  const allocated = generalOver.allocated_tracked + hugepages.allocated_tracked;
  const other = generalOver.allocated_other + hugepages.allocated_other;
  const free = generalOver.free + hugepages.free;
  const total = allocated + other + free;
  const formattedTotal = formatBytes(total, "B", { binary: true });
  const formattedAllocated = formatBytes(allocated, "B", {
    binary: true,
    convertTo: formattedTotal.unit,
  });
  return (
    <RAMPopover memory={memory} overCommit={overCommit}>
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
            {`${formattedAllocated.value} of ${formattedTotal.value}${formattedTotal.unit} allocated`}
          </small>
        }
        labelClassName="u-align--right"
        max={total}
        small
      />
    </RAMPopover>
  );
};

export default RAMColumn;
