import type { Filesystem } from "app/store/machine/types";

export type NormalisedFilesystem = {
  fstype: Filesystem["fstype"];
  id: Filesystem["id"];
  mountOptions: Filesystem["mount_options"];
  mountPoint: Filesystem["mount_point"];
  name: string | null;
  size: number | null;
};

export type NormalisedStorageDevice = {
  boot: boolean | null;
  firmware: string | null;
  id: number;
  model: string | null;
  name: string;
  numaNodes: number[];
  parentType: string | null;
  serial: string | null;
  size: number;
  tags: string[];
  testStatus: number | null;
  type: string;
  usedFor: string;
};

export type SeparatedDiskData = {
  available: NormalisedStorageDevice[];
  cacheSets: NormalisedStorageDevice[];
  datastores: NormalisedFilesystem[];
  filesystems: NormalisedFilesystem[];
  used: NormalisedStorageDevice[];
};
