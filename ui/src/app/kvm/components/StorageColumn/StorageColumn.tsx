import StoragePopover from "./StoragePopover";

import Meter from "app/base/components/Meter";
import { COLOURS } from "app/base/constants";
import type { KVMResource, KVMStoragePoolResources } from "app/kvm/types";
import { formatBytes } from "app/utils";

type Props = {
  pools: KVMStoragePoolResources;
  storage: KVMResource;
};

const StorageColumn = ({ pools, storage }: Props): JSX.Element | null => {
  const total =
    storage.allocated_other + storage.allocated_tracked + storage.free;
  const formattedTotal = formatBytes(total, "B", { decimals: 1 });
  const formattedAllocated = formatBytes(storage.allocated_tracked, "B", {
    convertTo: formattedTotal.unit,
    decimals: 1,
  });

  const meter = (
    <Meter
      className="u-no-margin--bottom"
      data={[
        {
          color: COLOURS.LINK,
          value: storage.allocated_tracked,
        },
        {
          color: COLOURS.POSITIVE,
          value: storage.allocated_other,
        },
        {
          color: COLOURS.LINK_FADED,
          value: storage.free,
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
  );

  return <StoragePopover pools={pools}>{meter}</StoragePopover>;
};

export default StorageColumn;
