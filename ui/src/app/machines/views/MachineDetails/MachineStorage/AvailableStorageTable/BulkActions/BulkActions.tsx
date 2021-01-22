import { Button, List, Tooltip } from "@canonical/react-components";

import type { BulkAction } from "../AvailableStorageTable";

import CreateDatastore from "./CreateDatastore";
import CreateRaid from "./CreateRaid";
import CreateVolumeGroup from "./CreateVolumeGroup";

import type { Disk, Machine, Partition } from "app/store/machine/types";
import { StorageLayout } from "app/store/machine/types";
import { canCreateRaid, canCreateVolumeGroup } from "app/store/machine/utils";

type Props = {
  bulkAction: BulkAction | null;
  selected: (Disk | Partition)[];
  setBulkAction: (bulkAction: BulkAction | null) => void;
  storageLayout: StorageLayout;
  systemId: Machine["system_id"];
};

const BulkActions = ({
  bulkAction,
  selected,
  setBulkAction,
  storageLayout,
  systemId,
}: Props): JSX.Element | null => {
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

  if (storageLayout === StorageLayout.VMFS6) {
    const createDatastoreEnabled = selected.length >= 1;

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
                ? "Select one or more storage devices to create a datastore"
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
