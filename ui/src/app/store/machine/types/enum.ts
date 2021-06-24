export enum BcacheModes {
  WRITE_BACK = "writeback",
  WRITE_THROUGH = "writethrough",
  WRITE_AROUND = "writearound",
}

export enum DiskTypes {
  BCACHE = "bcache",
  CACHE_SET = "cache-set",
  ISCSI = "iscsi",
  PHYSICAL = "physical",
  RAID_0 = "raid-0",
  RAID_1 = "raid-1",
  RAID_5 = "raid-5",
  RAID_6 = "raid-6",
  RAID_10 = "raid-10",
  VIRTUAL = "virtual",
  VMFS6 = "vmfs6",
  VOLUME_GROUP = "lvm-vg",
}

export enum MachineMeta {
  MODEL = "machine",
  PK = "system_id",
}

export enum PowerState {
  ERROR = "error",
  OFF = "off",
  ON = "on",
  UNKNOWN = "unknown",
}

export enum StorageLayout {
  BCACHE = "bcache",
  BLANK = "blank",
  FLAT = "flat",
  LVM = "lvm",
  UNKNOWN = "unknown",
  VMFS6 = "vmfs6",
}
