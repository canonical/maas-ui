import type { BootResourceSourceType, BootResourceType } from "./enum";

import type { Model } from "app/store/types/model";

export type BaseImageFields = {
  checked: boolean;
  deleted: boolean;
  name: string;
  title: string;
};

export type BootResource = Model & {
  arch: string;
  complete: boolean;
  downloading: boolean;
  icon: "in-progress" | "queued" | "succeeded" | "waiting";
  lastUpdate: string;
  name: string;
  numberOfNodes: number;
  rtype: BootResourceType;
  size: string;
  status: string;
  title: string;
};

export type BootResourceUbuntuSource = {
  keyring_data: string;
  keyring_filename: string;
  source_type: BootResourceSourceType;
  url: string;
};

export type BootResourceUbuntuRelease = BaseImageFields & {
  unsupported_arches: string[];
};

export type BootResourceUbuntuArch = BaseImageFields;

export type BootResourceUbuntu = {
  arches: BootResourceUbuntuArch[];
  commissioning_series: string;
  releases: BootResourceUbuntuRelease[];
  sources: BootResourceUbuntuSource[];
};

export type BootResourceOtherImage = BaseImageFields;

export type BootResourceUbuntuCoreImage = BaseImageFields;

export type BootResourceFetchedArch = BaseImageFields;

export type BootResourceFetchedRelease = BaseImageFields;

export type BootResourceFetchedImages = {
  arches: BootResourceFetchedArch[];
  releases: BootResourceFetchedRelease[];
};

export type BootResourceEventError = {
  error: string;
  event: string;
};

export type BootResourceStatuses = {
  deletingImage: boolean;
  fetching: boolean;
  polling: boolean;
  savingOther: boolean;
  savingUbuntuCore: boolean;
  savingUbuntu: boolean;
  stoppingImport: boolean;
};

export type BootResourceState = {
  connectionError: boolean;
  eventErrors: BootResourceEventError[];
  fetchedImages: BootResourceFetchedImages | null;
  otherImages: BootResourceOtherImage[];
  rackImportRunning: boolean;
  regionImportRunning: boolean;
  resources: BootResource[];
  statuses: BootResourceStatuses;
  ubuntu: BootResourceUbuntu | null;
  ubuntuCoreImages: BootResourceUbuntuCoreImage[];
};
