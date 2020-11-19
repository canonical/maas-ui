import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import {
  machineDisk as diskFactory,
  machineFilesystem as fsFactory,
  machinePartition as partitionFactory,
} from "testing/factories";
import {
  formatSize,
  formatType,
  hasMountedFilesystem,
  normaliseFilesystem,
  normaliseStorageDevice,
  separateStorageData,
  storageDeviceInUse,
} from "./utils";

describe("Machine storage utils", () => {
  describe("formatSize", () => {
    it("handles null case", () => {
      expect(formatSize(null)).toBe("—");
      expect(formatSize(0)).toBe("—");
    });

    it("can format size", () => {
      expect(formatSize(100)).toBe("100 B");
      expect(formatSize(10000)).toBe("10 KB");
    });
  });

  describe("formatType", () => {
    it("handles physical disks", () => {
      expect(formatType("physical")).toBe("Physical");
    });

    it("handles partitions", () => {
      expect(formatType("partition")).toBe("Partition");
    });

    it("handles volume groups", () => {
      expect(formatType("lvm-vg")).toBe("Volume group");
    });

    it("handles logical volumes", () => {
      expect(formatType("virtual", "lvm-vg")).toBe("Logical volume");
    });

    it("handles RAIDs", () => {
      expect(formatType("virtual", "raid-0")).toBe("RAID 0");
    });

    it("handles ISCSIs", () => {
      expect(formatType("iscsi")).toBe("ISCSI");
    });
  });

  describe("hasMountedFilesystem", () => {
    it("handles null case", () => {
      expect(hasMountedFilesystem(null)).toBe(false);
    });

    it("handles storage devices that have a filesystem with a mount point", () => {
      const disk = diskFactory({
        filesystem: fsFactory({ mount_point: "/path" }),
      });
      const partition = partitionFactory({
        filesystem: fsFactory({ mount_point: "/path" }),
      });
      expect(hasMountedFilesystem(disk)).toBe(true);
      expect(hasMountedFilesystem(partition)).toBe(true);
    });

    it(`handles storage device that do not have a filesystem, or the filesystem
      does not have a mount point`, () => {
      const disk1 = diskFactory({
        filesystem: null,
      });
      const disk2 = diskFactory({
        filesystem: fsFactory({ mount_point: "" }),
      });
      expect(hasMountedFilesystem(disk1)).toBe(false);
      expect(hasMountedFilesystem(disk2)).toBe(false);
    });
  });

  describe("storageDeviceInUse", () => {
    it("handles null case", () => {
      expect(storageDeviceInUse(null)).toBe(false);
    });

    it("handles cache sets", () => {
      const disk = diskFactory({
        type: "cache-set",
      });
      expect(storageDeviceInUse(disk)).toBe(true);
    });

    it(`handles storage device that have a filesystem, and that filesystem
      has a formatted type and mount point`, () => {
      const disk1 = diskFactory({
        filesystem: fsFactory({ is_format_fstype: true, mount_point: "/" }),
      });
      const disk2 = diskFactory({
        filesystem: fsFactory({ is_format_fstype: true, mount_point: "" }),
      });
      expect(storageDeviceInUse(disk1)).toBe(true);
      expect(storageDeviceInUse(disk2)).toBe(false);
    });

    it(`handles storage devices that have a filesystem, but the filesystem
      does not have a formatted type`, () => {
      const disk1 = diskFactory({
        filesystem: fsFactory({ is_format_fstype: false }),
      });
      const disk2 = diskFactory({
        filesystem: fsFactory({ is_format_fstype: true, mount_point: "" }),
      });
      expect(storageDeviceInUse(disk1)).toBe(true);
      expect(storageDeviceInUse(disk2)).toBe(false);
    });

    it(`handles storage devices that do not have a filesystem, but it has more
      than the minimum available space for a partition`, () => {
      const disk1 = diskFactory({
        available_size: MIN_PARTITION_SIZE - 1,
        filesystem: null,
      });
      const disk2 = diskFactory({
        available_size: MIN_PARTITION_SIZE + 1,
        filesystem: null,
      });
      expect(storageDeviceInUse(disk1)).toBe(true);
      expect(storageDeviceInUse(disk2)).toBe(false);
    });
  });

  describe("normaliseFilesystem", () => {
    it("can normalise a filesystem", () => {
      const filesystem = fsFactory();
      expect(normaliseFilesystem(filesystem, "fs-name", 1000)).toStrictEqual({
        fstype: filesystem.fstype,
        id: filesystem.id,
        mountOptions: filesystem.mount_options,
        mountPoint: filesystem.mount_point,
        name: "fs-name",
        size: 1000,
      });
    });
  });

  describe("normaliseStorageDevice", () => {
    it("can normalise a single disk", () => {
      const disk = diskFactory({
        numa_node: 0,
        numa_nodes: undefined,
        test_status: 0,
      });
      expect(normaliseStorageDevice(disk)).toStrictEqual({
        boot: disk.is_boot,
        firmware: disk.firmware_version,
        id: disk.id,
        model: disk.model,
        name: disk.name,
        numaNodes: [disk.numa_node],
        parentType: null,
        serial: disk.serial,
        size: disk.size,
        tags: disk.tags,
        testStatus: disk.test_status,
        type: disk.type,
        usedFor: disk.used_for,
      });
    });

    it("can normalise a volume group", () => {
      const disk = diskFactory({
        numa_node: undefined,
        numa_nodes: [0, 1],
        type: "lvm-vg",
      });
      expect(normaliseStorageDevice(disk)).toStrictEqual({
        boot: disk.is_boot,
        firmware: disk.firmware_version,
        id: disk.id,
        model: disk.model,
        name: disk.name,
        numaNodes: disk.numa_nodes,
        parentType: null,
        serial: disk.serial,
        size: disk.size,
        tags: disk.tags,
        testStatus: disk.test_status,
        type: disk.type,
        usedFor: disk.used_for,
      });
    });

    it("can normalise a virtual disk", () => {
      const disk = diskFactory({
        numa_node: 0,
        numa_nodes: undefined,
        parent: {
          id: 1,
          type: "lvm-vg",
          uuid: "abc123",
        },
        type: "virtual",
      });
      expect(normaliseStorageDevice(disk)).toStrictEqual({
        boot: disk.is_boot,
        firmware: disk.firmware_version,
        id: disk.id,
        model: disk.model,
        name: disk.name,
        numaNodes: [disk.numa_node],
        parentType: disk.parent?.type,
        serial: disk.serial,
        size: disk.size,
        tags: disk.tags,
        testStatus: disk.test_status,
        type: disk.type,
        usedFor: disk.used_for,
      });
    });

    it("can normalise a partition", () => {
      const partition = partitionFactory();
      expect(normaliseStorageDevice(partition)).toStrictEqual({
        boot: null,
        firmware: null,
        id: partition.id,
        model: null,
        name: partition.name,
        numaNodes: [],
        parentType: null,
        serial: null,
        size: partition.size,
        tags: partition.tags,
        testStatus: null,
        type: partition.type,
        usedFor: partition.used_for,
      });
    });
  });

  describe("separateStorageData", () => {
    it("can separate out available storage devices", () => {
      const [availablePartition, unavailablePartition] = [
        partitionFactory({
          filesystem: fsFactory({ mount_point: "" }),
          name: "available-partition",
        }),
        partitionFactory({
          filesystem: fsFactory({ mount_point: "/path" }),
          name: "used-partition",
        }),
      ];
      const disks = [
        diskFactory({
          available_size: MIN_PARTITION_SIZE + 1,
          name: "available-disk",
          partitions: [availablePartition, unavailablePartition],
        }),
        diskFactory({
          available_size: MIN_PARTITION_SIZE - 1,
          name: "used-disk",
          partitions: [],
        }),
      ];
      const { available } = separateStorageData(disks);
      expect(available.length).toBe(2);
      expect(available[0].name).toBe("available-disk");
      expect(available[1].name).toBe("available-partition");
    });

    it("can separate out used storage devices", () => {
      const [availablePartition, unavailablePartition] = [
        partitionFactory({
          filesystem: fsFactory({ mount_point: "" }),
          name: "available-partition",
        }),
        partitionFactory({
          filesystem: fsFactory({ mount_point: "/path" }),
          name: "used-partition",
        }),
      ];
      const disks = [
        diskFactory({
          available_size: MIN_PARTITION_SIZE + 1,
          name: "available-disk",
          partitions: [availablePartition, unavailablePartition],
        }),
        diskFactory({
          available_size: MIN_PARTITION_SIZE - 1,
          name: "used-disk",
          partitions: [],
        }),
      ];
      const { used } = separateStorageData(disks);
      expect(used.length).toBe(2);
      expect(used[0].name).toBe("used-partition");
      expect(used[1].name).toBe("used-disk");
    });

    it("can separate out filesystems", () => {
      const disks = [
        diskFactory({
          filesystem: fsFactory({ mount_point: "/disk-fs/path" }),
          name: "disk-fs",
          partitions: [],
        }),
        diskFactory({
          filesystem: null,
          partitions: [
            partitionFactory({
              filesystem: fsFactory({ mount_point: "/partition-fs/path" }),
              name: "partition-fs",
            }),
          ],
        }),
      ];
      const specialFilesystems = [
        fsFactory({
          fstype: "tmpfs",
          mount_point: "/special-fs/path",
        }),
      ];
      const { filesystems } = separateStorageData(disks, specialFilesystems);

      expect(filesystems.length).toBe(3);
      expect(filesystems[0].mountPoint).toBe("/disk-fs/path");
      expect(filesystems[1].mountPoint).toBe("/partition-fs/path");
      expect(filesystems[2].mountPoint).toBe("/special-fs/path");
    });

    it("can separate out cache sets", () => {
      const disks = [
        diskFactory({
          name: "cache0",
          type: "cache-set",
        }),
        diskFactory({
          name: "not-a-cache-set",
          type: "physical",
        }),
      ];
      const { cacheSets } = separateStorageData(disks);

      expect(cacheSets.length).toBe(1);
      expect(cacheSets[0].name).toBe("cache0");
    });

    it("can separate out datastores", () => {
      const disks = [
        diskFactory({
          filesystem: fsFactory({
            fstype: "vmfs6",
            mount_point: "/vmfs/volumes/datastore",
          }),
          name: "im-a-datastore",
          partitions: [],
        }),
        diskFactory({
          filesystem: fsFactory({
            fstype: "fat32",
            mount_point: "/",
          }),
          name: "not-a-datastore",
          partitions: [],
        }),
      ];
      const { datastores } = separateStorageData(disks);

      expect(datastores.length).toBe(1);
      expect(datastores[0].mountPoint).toBe("/vmfs/volumes/datastore");
    });
  });
});
