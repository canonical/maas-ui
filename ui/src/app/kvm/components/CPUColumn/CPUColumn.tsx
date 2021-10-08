import CPUPopover from "./CPUPopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { KVMResource } from "app/kvm/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  cores: KVMResource;
  overCommit: number;
};

const CPUColumn = ({ cores, overCommit }: Props): JSX.Element | null => {
  const { allocated_other, allocated_tracked, free } = resourceWithOverCommit(
    cores,
    overCommit
  );
  const total = allocated_other + allocated_tracked + free;
  return (
    <CPUPopover cores={cores} overCommit={overCommit}>
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
};

export default CPUColumn;
