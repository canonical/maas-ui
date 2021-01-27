import { Button, List, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { BulkAction } from "../AvailableStorageTable";

import CreateDatastore from "./CreateDatastore";
import CreateRaid from "./CreateRaid";
import CreateVolumeGroup from "./CreateVolumeGroup";
import UpdateDatastore from "./UpdateDatastore";

import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { StorageLayout } from "app/store/machine/types";
import {
  canCreateOrUpdateDatastore,
  canCreateRaid,
  canCreateVolumeGroup,
  isDatastore,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

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
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (!(machine && "disks" in machine)) {
    return null;
  }

  if (bulkAction === "createDatastore") {
    return (
      <CreateDatastore
        closeForm={() => setBulkAction(null)}
        selected={selected}
        systemId={systemId}
      />
    );
  }

  if (bulkAction === "createRaid") {
    return (
      <CreateRaid
        closeForm={() => setBulkAction(null)}
        selected={selected}
        systemId={systemId}
      />
    );
  }

  if (bulkAction === "createVolumeGroup") {
    return (
      <CreateVolumeGroup
        closeForm={() => setBulkAction(null)}
        selected={selected}
        systemId={systemId}
      />
    );
  }

  if (bulkAction === "updateDatastore") {
    return (
      <UpdateDatastore
        closeForm={() => setBulkAction(null)}
        selected={selected}
        systemId={systemId}
      />
    );
  }

  if (machine.detected_storage_layout === StorageLayout.VMFS6) {
    const hasDatastores = machine.disks.some((disk) =>
      isDatastore(disk.filesystem)
    );
    const createDatastoreEnabled = canCreateOrUpdateDatastore(selected);
    const updateDatastoreEnabled = createDatastoreEnabled && hasDatastores;

    let updateTooltip: string | null = null;
    if (!hasDatastores) {
      updateTooltip = "No datastores detected.";
    } else if (!updateDatastoreEnabled) {
      updateTooltip =
        "Select one or more unpartitioned and unformatted storage devices to add to an existing datastore.";
    }

    return (
      <List
        className="u-no-margin--bottom"
        data-test="vmfs6-bulk-actions"
        inline
        items={[
          <Tooltip
            data-test="create-datastore-tooltip"
            message={
              !createDatastoreEnabled
                ? "Select one or more unpartitioned and unformatted storage devices to create a datastore."
                : null
            }
            position="top-left"
          >
            <Button
              appearance="neutral"
              data-test="create-datastore"
              disabled={!createDatastoreEnabled}
              onClick={() => setBulkAction("createDatastore")}
            >
              Create datastore
            </Button>
          </Tooltip>,
          <Tooltip
            data-test="add-to-datastore-tooltip"
            message={updateTooltip}
            position="top-left"
          >
            <Button
              appearance="neutral"
              data-test="add-to-datastore"
              disabled={!updateDatastoreEnabled}
              onClick={() => setBulkAction("updateDatastore")}
            >
              Add to existing datastore
            </Button>
          </Tooltip>,
        ]}
      />
    );
  }

  const createRaidEnabled = canCreateRaid(selected);
  const createVgEnabled = canCreateVolumeGroup(selected);

  return (
    <List
      className="u-no-margin--bottom"
      data-test="vmfs6-bulk-actions"
      inline
      items={[
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
        </Tooltip>,
        <Tooltip
          data-test="create-raid-tooltip"
          message={
            !createRaidEnabled
              ? "Select two or more unpartitioned and unmounted storage devices to create a RAID."
              : null
          }
          position="top-left"
        >
          <Button
            appearance="neutral"
            data-test="create-raid"
            disabled={!createRaidEnabled}
            onClick={() => setBulkAction("createRaid")}
          >
            Create RAID
          </Button>
        </Tooltip>,
      ]}
    />
  );
};

export default BulkActions;
