import { define, extend } from "cooky-cutter";

import { timestamp } from "./general";
import { model } from "./model";

import type {
  BootResource,
  BootResourceEventError,
  BootResourceFetchedArch,
  BootResourceFetchedImages,
  BootResourceFetchedRelease,
  BootResourceOtherImage,
  BootResourceStatuses,
  BootResourceUbuntu,
  BootResourceUbuntuArch,
  BootResourceUbuntuCoreImage,
  BootResourceUbuntuRelease,
} from "@/app/store/bootresource/types";
import { BootResourceAction } from "@/app/store/bootresource/types";
import type { Model } from "@/app/store/types/model";

export const bootResource = extend<Model, BootResource>(model, {
  rtype: 0,
  name: "ubuntu/bionic",
  title: "18.04 LTS",
  arch: "amd64",
  size: "650.4 MB",
  complete: false,
  status: "Waiting for rack controller(s) to sync",
  icon: "waiting",
  downloading: false,
  machineCount: 0,
  numberOfNodes: 0,
  lastUpdate: () => timestamp("Tue, 08 Jun. 2021 02:12:47"),
  lastDeployed: () => timestamp("Tue, 08 Jun. 2021 02:12:47"),
  canDeployToMemory: true,
});

export const bootResourceUbuntu = define<BootResourceUbuntu>({
  arches: () => [],
  commissioning_series: "focal",
  releases: () => [],
  sources: () => [],
});

export const bootResourceUbuntuArch = define<BootResourceUbuntuArch>({
  name: "amd64",
  title: "amd64",
  checked: false,
  deleted: false,
});

export const bootResourceUbuntuCoreImage = define<BootResourceUbuntuCoreImage>({
  checked: false,
  deleted: false,
  name: "ubuntu/core",
  title: "Ubuntu Core",
});

export const bootResourceUbuntuRelease = define<BootResourceUbuntuRelease>({
  name: "xenial",
  title: "16.04 LTS",
  unsupported_arches: () => [],
  checked: false,
  deleted: false,
});

export const bootResourceOtherImage = define<BootResourceOtherImage>({
  checked: false,
  deleted: false,
  name: "centos/amd64/generic/8",
  title: "CentOS 8",
});

export const bootResourceFetchedArch = define<BootResourceFetchedArch>({
  name: "amd64",
  title: "amd64",
  checked: false,
  deleted: false,
});

export const bootResourceFetchedRelease = define<BootResourceFetchedRelease>({
  name: "xenial",
  title: "16.04 LTS",
  checked: false,
  deleted: false,
});

export const bootResourceFetchedImages = define<BootResourceFetchedImages>({
  arches: () => [],
  releases: () => [],
});

export const bootResourceEventError = define<BootResourceEventError>({
  error: "Poll failed",
  event: BootResourceAction.POLL,
});

export const bootResourceStatuses = define<BootResourceStatuses>({
  deletingImage: false,
  fetching: false,
  polling: false,
  savingOther: false,
  savingUbuntuCore: false,
  savingUbuntu: false,
  stoppingImport: false,
});
