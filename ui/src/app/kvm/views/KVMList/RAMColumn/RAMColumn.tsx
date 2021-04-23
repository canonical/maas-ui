import { useSelector } from "react-redux";

import RAMPopover from "./RAMPopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import podSelectors from "app/store/pod/selectors";
import { resourceWithOverCommit } from "app/store/pod/utils";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

type Props = { id: number };

const RAMColumn = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );

  if (pod) {
    const { memory_over_commit_ratio, resources } = pod;
    const { memory } = resources;
    const { general, hugepages } = memory;
    const generalOver = resourceWithOverCommit(
      general,
      memory_over_commit_ratio
    );
    const allocated =
      generalOver.allocated_tracked + hugepages.allocated_tracked;
    const other = generalOver.allocated_other + hugepages.allocated_other;
    const free = generalOver.free + hugepages.free;
    const total = allocated + other + free;
    const formattedTotal = formatBytes(total, "B", { binary: true });
    const formattedAllocated = formatBytes(allocated, "B", {
      binary: true,
      convertTo: formattedTotal.unit,
    });
    return (
      <RAMPopover memory={memory} overCommit={memory_over_commit_ratio}>
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
  }
  return null;
};

export default RAMColumn;
