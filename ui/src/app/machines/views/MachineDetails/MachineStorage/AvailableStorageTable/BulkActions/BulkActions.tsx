import { Button, Tooltip } from "@canonical/react-components";

import type { BulkAction } from "../AvailableStorageTable";

import CreateVolumeGroup from "./CreateVolumeGroup";

import type { Disk, Machine, Partition } from "app/store/machine/types";
import { canCreateVolumeGroup } from "app/store/machine/utils";

type Props = {
  bulkAction: BulkAction | null;
  selected: (Disk | Partition)[];
  setBulkAction: (bulkAction: BulkAction | null) => void;
  systemId: Machine["system_id"];
};

const BulkActions = ({
  bulkAction,
  selected,
  setBulkAction,
  systemId,
}: Props): JSX.Element | null => {
  const createVgEnabled = canCreateVolumeGroup(selected);

  if (bulkAction === "createVolumeGroup") {
    return (
      <CreateVolumeGroup
        closeForm={() => setBulkAction(null)}
        selected={selected}
        systemId={systemId}
      />
    );
  }
  return (
    <ul className="p-inline-list u-no-margin--bottom">
      <li className="p-inline-list__item">
        <Tooltip
          data-test="create-vg-tooltip"
          message={
            !createVgEnabled
              ? "Select one or more unpartitioned and unformatted storage devices to create a volume group."
              : null
          }
          position="top-left"
        >
          <Button
            appearance="neutral"
            data-test="create-vg"
            disabled={!createVgEnabled}
            onClick={() => setBulkAction("createVolumeGroup")}
          >
            Create volume group
          </Button>
        </Tooltip>
      </li>
    </ul>
  );
};

export default BulkActions;
