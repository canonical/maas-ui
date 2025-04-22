import { useEffect, useState } from "react";

import { MainTable } from "@canonical/react-components";
import type { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";

import BulkActions from "./BulkActions";
import StorageDeviceActions from "./StorageDeviceActions";

import DoubleRow from "@/app/base/components/DoubleRow";
import GroupCheckbox from "@/app/base/components/GroupCheckbox";
import RowCheckbox from "@/app/base/components/RowCheckbox";
import TagLinks from "@/app/base/components/TagLinks";
import DiskBootStatus from "@/app/base/components/node/DiskBootStatus";
import DiskNumaNodes from "@/app/base/components/node/DiskNumaNodes";
import DiskTestStatus from "@/app/base/components/node/DiskTestStatus";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { ControllerDetails } from "@/app/store/controller/types";
import { FilterControllers } from "@/app/store/controller/utils";
import type { MachineDetails } from "@/app/store/machine/types";
import { FilterMachines } from "@/app/store/machine/utils";
import type { Disk, Node, Partition } from "@/app/store/types/node";
import {
  diskAvailable,
  formatSize,
  formatType,
  getDiskById,
  getPartitionById,
  isDatastore,
  isDisk,
  isPartition,
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
 * Generate a unique ID for a disk or partition. Since both disks and partitions
 * are used in the table it's possible for the id number alone to be non-unique.
 * @param storageDevice - the disk or partition to create a unique ID for.
 * @returns unique ID for the disk or partition
 */
export const uniqueId = (storageDevice: Disk | Partition): string =>
  `${storageDevice.type}-${storageDevice.id}`;

/**
 * Returns whether a storage device is available.
 * @param storageDevice - the disk or partition to check.
 * @returns whether a storage device is available.
 */
const isAvailable = (storageDevice: Disk | Partition) => {
  if (isDatastore(storageDevice.filesystem)) {
    return false;
  }

  if (isDisk(storageDevice)) {
    return diskAvailable(storageDevice);
  }
  return partitionAvailable(storageDevice);
};

/**
 * Returns whether a storage device is currently in selected state.
 * @param storageDevice - the disk or partition to check.
 * @param selected - list of currently selected storage devices.
 * @returns whether a storage device is selected.
 */
const isSelected = (
  storageDevice: Disk | Partition,
  selected: (Disk | Partition)[]
) =>
  selected.some(
    (item) => item.id === storageDevice.id && item.type === storageDevice.type
  );

/**
 * Normalise rendered row data so that both disks and partitions can be displayed.
 * @param systemId - the system_id of the machine
 * @param isMachine
 * @param storageDevice - the disk or partition to normalise.
 * @param actionsDisabled - whether actions should be disabled.
 * @param selected - the currently selected storage devices.
 * @param handleRowCheckbox - row checkbox handler function.
 * @param setSidePanelContent - function to display the required sidepanel form
 * @param parentDisk - the parent disk of the partition for editing a partition
 * @returns normalised row data
 */
const normaliseRowData = (
  systemId: Node["system_id"],
  isMachine: boolean,
  storageDevice: Disk | Partition,
  actionsDisabled: boolean,
  selected: (Disk | Partition)[],
  handleRowCheckbox: (storageDevice: Disk | Partition) => void,
  setSidePanelContent: SetSidePanelContent,
  parentDisk?: Disk
) => {
  const rowId = uniqueId(storageDevice);

  return {
    columns: [
      {
        "aria-label": "Name & Serial",
        content: (
          <DoubleRow
            primary={
              isMachine ? (
                <RowCheckbox
                  checkSelected={isSelected}
                  data-testid={`checkbox-${rowId}`}
                  disabled={actionsDisabled}
                  handleRowCheckbox={handleRowCheckbox}
                  inputLabel={storageDevice.name}
                  item={storageDevice}
                  items={selected}
                />
              ) : (
                storageDevice.name
              )
            }
            primaryTitle={storageDevice.name}
            secondary={"serial" in storageDevice && storageDevice.serial}
            secondaryClassName={isMachine ? "u-nudge--secondary-row" : null}
            secondaryTitle={
              "serial" in storageDevice ? storageDevice.serial : null
            }
          />
        ),
      },
      {
        "aria-label": "Model & Firmware",
        content: (
          <DoubleRow
            primary={"model" in storageDevice ? storageDevice.model : "—"}
            primaryTitle={"model" in storageDevice ? storageDevice.model : null}
            secondary={
              "firmware_version" in storageDevice &&
              storageDevice.firmware_version
            }
            secondaryTitle={
              "firmware_version" in storageDevice
                ? storageDevice.firmware_version
                : null
            }
          />
        ),
      },
      {
        "aria-label": "Boot",
        content: (
          <DoubleRow
            primary={
              "is_boot" in storageDevice ? (
                <DiskBootStatus disk={storageDevice} />
              ) : (
                "—"
              )
            }
          />
        ),
      },
      {
        "aria-label": "Size",
        content: (
          <DoubleRow
            primary={formatSize(storageDevice.size)}
            secondary={
              "available_size" in storageDevice &&
              `Free: ${formatSize(storageDevice.available_size)}`
            }
          />
        ),
      },
      {
        "aria-label": "Type & NUMA node",
        content: (
          <DoubleRow
            primary={formatType(storageDevice)}
            secondary={
              ("numa_node" in storageDevice ||
                "numa_nodes" in storageDevice) && (
                <DiskNumaNodes disk={storageDevice} />
              )
            }
          />
        ),
      },
      {
        "aria-label": "Health & Tags",
        content: (
          <DoubleRow
            primary={
              "test_status" in storageDevice ? (
                <DiskTestStatus testStatus={storageDevice.test_status} />
              ) : (
                "—"
              )
            }
            secondary={
              <TagLinks
                getLinkURL={(tag) => {
                  if (isMachine) {
                    const filter = FilterMachines.filtersToQueryString({
                      storage_tags: [`=${tag}`],
                    });
                    return `${urls.machines.index}${filter}`;
                  }
                  const filter = FilterControllers.filtersToQueryString({
                    storage_tags: [`=${tag}`],
                  });
                  return `${urls.controllers.index}${filter}`;
                }}
                tags={storageDevice.tags}
              />
            }
          />
        ),
      },
      ...(isMachine
        ? [
            {
              "aria-label": "Actions",
              className: "u-align--right",
              content: (
                <StorageDeviceActions
                  disabled={actionsDisabled}
                  onActionClick={(_: StorageDeviceAction, view) => {
                    if (view) {
                      if (view === MachineSidePanelViews.EDIT_PARTITION) {
                        setSidePanelContent({
                          view,
                          extras: {
                            systemId,
                            disk: parentDisk,
                            partition: storageDevice,
                          },
                        });
                        return;
                      }
                      setSidePanelContent({
                        view,
                        extras: {
                          systemId,
                          disk: isDisk(storageDevice)
                            ? storageDevice
                            : undefined,
                          partition: isPartition(storageDevice)
                            ? storageDevice
                            : undefined,
                        },
                      });
                    }
                  }}
                  storageDevice={storageDevice}
                  systemId={systemId}
                />
              ),
            },
          ]
        : []),
    ],
    key: rowId,
  };
};

const AvailableStorageTable = ({
  canEditStorage,
  node,
}: Props): React.ReactElement => {
  const [selected, setSelected] = useState<(Disk | Partition)[]>([]);
  const isMachine = nodeIsMachine(node);
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const handleRowCheckbox = (storageDevice: Disk | Partition) => {
    const newSelected = isSelected(storageDevice, selected)
      ? selected.filter((item) => item !== storageDevice)
      : [...selected, storageDevice];
    setSelected(newSelected);
  };
  const handleAllCheckbox = () => {
    if (selected.length) {
      setSelected([]);
    } else {
      const newSelected = node.disks.reduce<(Disk | Partition)[]>(
        (selected, disk) => {
          if (isAvailable(disk)) {
            selected.push(disk);
          }
          if (disk.partitions) {
            disk.partitions.forEach((partition) => {
              if (isAvailable(partition)) {
                selected.push(partition);
              }
            });
          }
          return selected;
        },
        []
      );
      setSelected(newSelected);
    }
  };
  const actionsDisabled = !canEditStorage || Boolean(sidePanelContent?.view);

  // To prevent selected state from becoming stale, set it directly from the
  // machine object when it changes (e.g. when a disk is deleted or updated).
  useEffect(() => {
    setSelected((prevSelected) => {
      const newSelected = [];
      for (const item of prevSelected) {
        if (isPartition(item)) {
          const partition = getPartitionById(node.disks, item.id);
          if (partition && isAvailable(partition)) {
            newSelected.push(partition);
          }
        } else {
          const disk = getDiskById(node.disks, item.id);
          if (disk && isAvailable(disk)) {
            newSelected.push(disk);
          }
        }
      }
      return newSelected;
    });
  }, [node.disks]);

  const rows: MainTableRow[] = [];
  node.disks.forEach((disk) => {
    if (isAvailable(disk)) {
      rows.push({
        ...normaliseRowData(
          node.system_id,
          isMachine,
          disk,
          actionsDisabled,
          selected,
          handleRowCheckbox,
          setSidePanelContent
        ),
      });
    }

    if (disk.partitions) {
      disk.partitions.forEach((partition) => {
        if (isAvailable(partition)) {
          rows.push({
            ...normaliseRowData(
              node.system_id,
              isMachine,
              partition,
              actionsDisabled,
              selected,
              handleRowCheckbox,
              setSidePanelContent,
              disk
            ),
          });
        }
      });
    }
  });

  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        expanding
        headers={[
          {
            content: (
              <div className="u-flex">
                {isMachine && (
                  <GroupCheckbox
                    data-testid="all-storage-checkbox"
                    disabled={actionsDisabled}
                    handleGroupCheckbox={handleAllCheckbox}
                    items={rows.map(({ key }) => key)}
                    selectedItems={selected.map((item) => uniqueId(item))}
                  />
                )}
                <div>
                  <div>Name</div>
                  <div>Serial</div>
                </div>
              </div>
            ),
          },
          {
            content: (
              <div>
                <div>Model</div>
                <div>Firmware</div>
              </div>
            ),
          },
          {
            content: <div>Boot</div>,
          },
          {
            content: <div>Size</div>,
          },
          {
            content: (
              <div>
                <div>Type</div>
                <div>NUMA node</div>
              </div>
            ),
          },
          {
            content: (
              <div>
                <div>Health</div>
                <div>Tags</div>
              </div>
            ),
          },
          ...(isMachine
            ? [
                {
                  className: "u-align--right",
                  content: <div>Actions</div>,
                },
              ]
            : []),
        ]}
        responsive
        rows={rows}
      />
      {rows.length === 0 && (
        <div className="u-nudge-right--small u-sv2" data-testid="no-available">
          No available disks or partitions.
        </div>
      )}
      {isMachine && canEditStorage && (
        <BulkActions selected={selected} systemId={node.system_id} />
      )}
    </>
  );
};

export default AvailableStorageTable;
