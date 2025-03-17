import { useSelector } from "react-redux";

import { StorageDeviceAction } from "../AvailableStorageTable";

import TableActionsDropdown from "@/app/base/components/TableActionsDropdown";
import type { TableAction } from "@/app/base/components/TableActionsDropdown";
import { MachineSidePanelViews } from "@/app/machines/constants";
import machineSelectors from "@/app/store/machine/selectors";
import type { MachineDetails } from "@/app/store/machine/types";
import { isMachineDetails } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import type { Disk, Partition } from "@/app/store/types/node";
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
} from "@/app/store/utils";

type Props = {
  disabled: boolean;
  storageDevice: Disk | Partition;
  onActionClick: (
    rowAction: StorageDeviceAction,
    view?: TableAction<StorageDeviceAction>["view"]
  ) => void;
  systemId: MachineDetails["system_id"];
};

const StorageDeviceActions = ({
  disabled,
  storageDevice,
  onActionClick,
  systemId,
}: Props): React.ReactElement | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  let actions: TableAction<StorageDeviceAction>[] = [];

  if (isMachineDetails(machine)) {
    if (isDisk(storageDevice)) {
      actions = [
        {
          label: "Add logical volume...",
          show: canCreateLogicalVolume(storageDevice),
          type: StorageDeviceAction.CREATE_LOGICAL_VOLUME,
          view: MachineSidePanelViews.CREATE_LOGICAL_VOLUME,
        },
        {
          label: "Add partition...",
          show: canBePartitioned(storageDevice),
          type: StorageDeviceAction.CREATE_PARTITION,
          view: MachineSidePanelViews.CREATE_PARTITION,
        },
        {
          label: "Create bcache...",
          show: canCreateBcache(machine.disks, storageDevice),
          type: StorageDeviceAction.CREATE_BCACHE,
          view: MachineSidePanelViews.CREATE_BCACHE,
        },
        {
          label: "Create cache set...",
          show: canCreateCacheSet(storageDevice),
          type: StorageDeviceAction.CREATE_CACHE_SET,
          view: MachineSidePanelViews.CREATE_CACHE_SET,
        },
        {
          label: "Set boot disk...",
          show: canSetBootDisk(machine.detected_storage_layout, storageDevice),
          type: StorageDeviceAction.SET_BOOT_DISK,
          view: MachineSidePanelViews.SET_BOOT_DISK,
        },
        {
          label: `Edit ${formatType(storageDevice, true)}...`,
          show: !isVolumeGroup(storageDevice),
          type: StorageDeviceAction.EDIT_DISK,
          view: MachineSidePanelViews.EDIT_DISK,
        },
        {
          label: "Remove volume group...",
          show: canBeDeleted(storageDevice) && isVolumeGroup(storageDevice),
          type: StorageDeviceAction.DELETE_VOLUME_GROUP,
          view: MachineSidePanelViews.DELETE_VOLUME_GROUP,
        },
        {
          label: `Remove ${formatType(storageDevice, true)}...`,
          show: canBeDeleted(storageDevice) && !isVolumeGroup(storageDevice),
          type: StorageDeviceAction.DELETE_DISK,
          view: MachineSidePanelViews.DELETE_DISK,
        },
      ];
    }
    if (isPartition(storageDevice)) {
      actions = [
        {
          label: "Edit partition...",
          type: StorageDeviceAction.EDIT_PARTITION,
          view: MachineSidePanelViews.EDIT_PARTITION,
        },
        {
          label: "Create bcache...",
          show: canCreateBcache(machine.disks, storageDevice),
          type: StorageDeviceAction.CREATE_BCACHE,
          view: MachineSidePanelViews.CREATE_BCACHE,
        },
        {
          label: "Create cache set...",
          show: canCreateCacheSet(storageDevice),
          type: StorageDeviceAction.CREATE_CACHE_SET,
          view: MachineSidePanelViews.CREATE_CACHE_SET,
        },
        {
          label: "Remove partition...",
          type: StorageDeviceAction.DELETE_PARTITION,
          view: MachineSidePanelViews.REMOVE_PARTITION,
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
