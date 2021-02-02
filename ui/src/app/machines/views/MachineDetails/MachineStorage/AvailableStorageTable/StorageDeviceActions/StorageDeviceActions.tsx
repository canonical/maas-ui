import { useSelector } from "react-redux";

import { StorageDeviceAction } from "../AvailableStorageTable";

import TableActionsDropdown from "app/base/components/TableActionsDropdown";
import type { TableAction } from "app/base/components/TableActionsDropdown";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, MachineDetails, Partition } from "app/store/machine/types";
import {
  canBeDeleted,
  canBePartitioned,
  canCreateBcache,
  canCreateCacheSet,
  canCreateLogicalVolume,
  canSetBootDisk,
  formatType,
  isDisk,
  isPartition,
  isVolumeGroup,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  disabled: boolean;
  storageDevice: Disk | Partition;
  onActionClick: (rowAction: StorageDeviceAction) => void;
  systemId: MachineDetails["system_id"];
};

const StorageDeviceActions = ({
  disabled,
  storageDevice,
  onActionClick,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  let actions: TableAction<StorageDeviceAction>[] = [];

  if (machine && "disks" in machine) {
    if (isDisk(storageDevice)) {
      actions = [
        {
          label: "Add logical volume...",
          show: canCreateLogicalVolume(storageDevice),
          type: StorageDeviceAction.CREATE_LOGICAL_VOLUME,
        },
        {
          label: "Add partition...",
          show: canBePartitioned(storageDevice),
          type: StorageDeviceAction.CREATE_PARTITION,
        },
        {
          label: "Create bcache...",
          show: canCreateBcache(machine.disks, storageDevice),
          type: StorageDeviceAction.CREATE_BCACHE,
        },
        {
          label: "Create cache set...",
          show: canCreateCacheSet(storageDevice),
          type: StorageDeviceAction.CREATE_CACHE_SET,
        },
        {
          label: "Set boot disk...",
          show: canSetBootDisk(machine.detected_storage_layout, storageDevice),
          type: StorageDeviceAction.SET_BOOT_DISK,
        },
        {
          label: `Edit ${formatType(storageDevice, true)}...`,
          show: !isVolumeGroup(storageDevice),
          type: StorageDeviceAction.EDIT_DISK,
        },
        {
          label: "Remove volume group...",
          show: canBeDeleted(storageDevice) && isVolumeGroup(storageDevice),
          type: StorageDeviceAction.DELETE_VOLUME_GROUP,
        },
        {
          label: `Remove ${formatType(storageDevice, true)}...`,
          show: canBeDeleted(storageDevice) && !isVolumeGroup(storageDevice),
          type: StorageDeviceAction.DELETE_DISK,
        },
      ];
    }
    if (isPartition(storageDevice)) {
      actions = [
        {
          label: "Edit partition...",
          type: StorageDeviceAction.EDIT_PARTITION,
        },
        {
          label: "Create bcache...",
          show: canCreateBcache(machine.disks, storageDevice),
          type: StorageDeviceAction.CREATE_BCACHE,
        },
        {
          label: "Create cache set...",
          show: canCreateCacheSet(storageDevice),
          type: StorageDeviceAction.CREATE_CACHE_SET,
        },
        {
          label: "Remove partition...",
          type: StorageDeviceAction.DELETE_PARTITION,
        },
      ];
    }

    return (
      <TableActionsDropdown
        actions={actions}
        disabled={disabled}
        onActionClick={onActionClick}
      />
    );
  }
  return null;
};

export default StorageDeviceActions;
