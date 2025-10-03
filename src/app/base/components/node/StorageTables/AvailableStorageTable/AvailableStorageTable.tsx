import { useState } from "react";
import "./_index.scss";

import { GenericTable } from "@canonical/maas-react-components";
import type { RowSelectionState } from "@tanstack/react-table";

import BulkActions from "./BulkActions";
import type { AvailableStorageRow } from "./useAvailableStorageColumns/useAvailableStorageColumns";
import useAvailableStorageColumns from "./useAvailableStorageColumns/useAvailableStorageColumns";

import { useSidePanel } from "@/app/base/side-panel-context";
import type { ControllerDetails } from "@/app/store/controller/types";
import type { MachineDetails } from "@/app/store/machine/types";
import {
  diskAvailable,
  isDatastore,
  isDisk,
  nodeIsMachine,
  partitionAvailable,
} from "@/app/store/utils";

// Actions that are performed on multiple devices at once
export enum BulkAction {
  CREATE_DATASTORE = "createDatastore",
  CREATE_RAID = "createRaid",
  CREATE_VOLUME_GROUP = "createVolumeGroup",
  UPDATE_DATASTORE = "updateDatastore",
}

// Actions that are performed on a single device
export enum StorageDeviceAction {
  CREATE_BCACHE = "createBcache",
  CREATE_CACHE_SET = "createCacheSet",
  CREATE_LOGICAL_VOLUME = "createLogicalVolume",
  CREATE_PARTITION = "createPartition",
  DELETE_DISK = "deleteDisk",
  DELETE_PARTITION = "deletePartition",
  DELETE_VOLUME_GROUP = "deleteVolumeGroup",
  EDIT_DISK = "editDisk",
  EDIT_PARTITION = "editPartition",
  SET_BOOT_DISK = "setBootDisk",
}

type Props = {
  canEditStorage: boolean;
  node: ControllerDetails | MachineDetails;
};

/**
 * Returns whether a storage device is available.
 * @param storageDevice - the disk or partition to check.
 * @returns whether a storage device is available.
 */
const isAvailable = (storageDevice: AvailableStorageRow) => {
  if (isDatastore(storageDevice.filesystem)) {
    return false;
  }

  if (isDisk(storageDevice)) {
    return diskAvailable(storageDevice);
  }
  return partitionAvailable(storageDevice);
};

const AvailableStorageTable = ({
  canEditStorage,
  node,
}: Props): React.ReactElement => {
  const isMachine = nodeIsMachine(node);
  const { sidePanelContent } = useSidePanel();
  const actionsDisabled = !canEditStorage || Boolean(sidePanelContent?.view);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useAvailableStorageColumns({
    isMachine,
    actionsDisabled,
    systemId: node.system_id,
  });

  const rows: AvailableStorageRow[] = [];

  node.disks.forEach((disk) => {
    if (isAvailable(disk)) {
      rows.push(disk);
    }

    if (disk.partitions) {
      disk.partitions.forEach((partition) => {
        if (isAvailable(partition)) {
          rows.push(partition);
        }
      });
    }
  });

  const extractSelected = (
    data: AvailableStorageRow[],
    rowSelection: RowSelectionState
  ): AvailableStorageRow[] => {
    const result: AvailableStorageRow[] = [];
    const ids = Object.entries(rowSelection)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    data.forEach((item) => {
      if (ids.includes(item.id.toString())) {
        result.push(item);
      }
    });

    return result;
  };

  return (
    <>
      <GenericTable
        canSelect={isMachine ? (_) => !actionsDisabled : false}
        columns={columns}
        data={rows}
        disabledSelectionTooltip={"This machine's disks cannot be modified."}
        isLoading={false}
        noData="No available disks or partitions."
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      {isMachine && canEditStorage && (
        <BulkActions
          selected={extractSelected(rows, rowSelection)}
          systemId={node.system_id}
        />
      )}
    </>
  );
};

export default AvailableStorageTable;
