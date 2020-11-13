import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import type { Disk, Filesystem, Partition } from "app/store/machine/types";
import type {
  NormalisedFilesystem,
  NormalisedStorageDevice,
  SeparatedDiskData,
} from "./types";

/**
 * Returns whether a storage device has a mounted filesystem. If a filesystem is
 * unmounted, it will show in the "Available disks and partitions" table.
 * @param storageDevice - the storage device to check.
 * @returns whether the storage device has a mounted filesystem.
 */
export const hasMountedFilesystem = (
  storageDevice: Disk | Partition | null
): boolean => !!storageDevice?.filesystem?.mount_point;

/**
 * Returns whether a storage device is currently in use.
 * @param storageDevice - the storage device to check.
 * @returns whether the storage device is currently in use.
 */
export const storageDeviceInUse = (
  storageDevice: Disk | Partition | null
): boolean => {
  if (!storageDevice) {
    return false;
  }

  const { filesystem, type } = storageDevice;

  if (type === "cache-set") {
    return true;
  }
  if (!!filesystem) {
    return (
      (!!filesystem.is_format_fstype && !!filesystem.mount_point) ||
      !filesystem.is_format_fstype
    );
  }
  return (storageDevice as Disk).available_size < MIN_PARTITION_SIZE;
};

/**
 * Normalises a filesystem for use in the filesystems table.
 * @param filesystem - the base filesystem object.
 * @param name - the name to give the filesystem.
 * @param size - the size to give the filesystem.
 * @returns Normalised filesystem object.
 */
export const normaliseFilesystem = (
  filesystem: Filesystem,
  name?: string,
  size?: number
): NormalisedFilesystem => ({
  fstype: filesystem.fstype,
  id: filesystem.id,
  mountPoint: filesystem.mount_point,
  mountOptions: filesystem.mount_options,
  name: name || null,
  size: size || null,
});

/**
 * Normalises storage device for use in available/used disk and partition tables.
 * @param storageDevice - the base storage device object.
 * @param name - the name to give the filesystem.
 * @param size - the size to give the filesystem.
 * @returns Normalised storage device object.
 */
export const normaliseStorageDevice = (
  storageDevice: Disk | Partition
): NormalisedStorageDevice => {
  let numaNodes: NormalisedStorageDevice["numaNodes"] = [];
  if (
    "numa_node" in storageDevice &&
    typeof storageDevice.numa_node === "number"
  ) {
    numaNodes = [storageDevice.numa_node];
  } else if (
    "numa_nodes" in storageDevice &&
    Array.isArray(storageDevice.numa_nodes)
  ) {
    numaNodes = storageDevice.numa_nodes;
  }

  return {
    boot: "is_boot" in storageDevice ? storageDevice.is_boot : null,
    firmware:
      "firmware_version" in storageDevice
        ? storageDevice.firmware_version
        : null,
    id: storageDevice.id,
    model: "model" in storageDevice ? storageDevice.model : null,
    name: storageDevice.name,
    numaNodes,
    parentType: "parent" in storageDevice ? storageDevice.parent.type : null,
    serial: "serial" in storageDevice ? storageDevice.serial : null,
    size: storageDevice.size,
    tags: storageDevice.tags,
    testStatus:
      "test_status" in storageDevice ? storageDevice.test_status : null,
    type: storageDevice.type,
    usedFor: storageDevice.used_for,
  };
};

/**
 * Separates machine storage data for use in different sections of the storage
 * tab.
 * @param disks - the machine's disks.
 * @param specialFilesystems - the machine's special filesystems.
 * @returns Storage data separated by filesystems, available and used.
 */
export const separateStorageData = (
  disks: Disk[] = [],
  specialFilesystems: Filesystem[] = []
): SeparatedDiskData => {
  const data = disks.reduce(
    (data: SeparatedDiskData, disk: Disk) => {
      const normalisedDisk = normaliseStorageDevice(disk);

      if (storageDeviceInUse(disk)) {
        data.used.push(normalisedDisk);
      } else {
        data.available.push(normalisedDisk);
      }

      if (hasMountedFilesystem(disk)) {
        data.filesystems.push(
          normaliseFilesystem(disk.filesystem, disk.name, disk.size)
        );
      }

      if (disk.partitions && disk.partitions.length > 0) {
        disk.partitions.forEach((partition) => {
          const normalisedPartition = normaliseStorageDevice(partition);

          if (storageDeviceInUse(partition)) {
            data.used.push(normalisedPartition);
          } else {
            data.available.push(normalisedPartition);
          }

          if (hasMountedFilesystem(partition)) {
            data.filesystems.push(
              normaliseFilesystem(
                partition.filesystem,
                partition.name,
                partition.size
              )
            );
          }
        });
      }

      return data;
    },
    { available: [], filesystems: [], used: [] }
  );

  if (specialFilesystems.length > 0) {
    specialFilesystems.forEach((specialFilesystem) => {
      data.filesystems.push(normaliseFilesystem(specialFilesystem));
    });
  }

  return data;
};
