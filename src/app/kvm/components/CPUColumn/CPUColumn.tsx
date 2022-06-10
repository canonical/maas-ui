import CPUPopover from "./CPUPopover";

import KVMResourceMeter from "app/kvm/components/KVMResourceMeter";
import type { KVMResource } from "app/kvm/types";
import { resourceWithOverCommit } from "app/store/pod/utils";

type Props = {
  cores: KVMResource;
  overCommit?: number;
};

const CPUColumn = ({ cores, overCommit = 1 }: Props): JSX.Element | null => {
  const coresWithOver = resourceWithOverCommit(cores, overCommit);
  return (
    <CPUPopover cores={cores} overCommit={overCommit}>
      <KVMResourceMeter
        allocated={coresWithOver.allocated_tracked}
        other={coresWithOver.allocated_other}
        free={coresWithOver.free}
        segmented
      />
    </CPUPopover>
  );
};

export default CPUColumn;
