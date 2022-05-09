import { define, extend } from "cooky-cutter";

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
  BootResourceUbuntuSource,
} from "app/store/bootresource/types";
import {
  BootResourceSourceType,
  BootResourceAction,
} from "app/store/bootresource/types";
import type { Model } from "app/store/types/model";

export const bootResource = extend<Model, BootResource>(model, {
  arch: "amd64",
  complete: false,
  downloading: false,
  icon: "waiting",
  lastUpdate: "Tue, 08 Jun. 2021 02:12:47",
  name: "ubuntu/bionic",
  numberOfNodes: 0,
  rtype: 0,
  size: "650.4 MB",
  status: "Waiting for rack controller(s) to sync",
  title: "18.04 LTS",
});

export const bootResourceUbuntu = define<BootResourceUbuntu>({
  arches: () => [],
  commissioning_series: "focal",
  releases: () => [],
  sources: () => [],
});

export const bootResourceUbuntuArch = define<BootResourceUbuntuArch>({
  checked: false,
  deleted: false,
  name: "amd64",
  title: "amd64",
});

export const bootResourceUbuntuCoreImage = define<BootResourceUbuntuCoreImage>({
  checked: false,
  deleted: false,
  name: "ubuntu/core",
  title: "Ubuntu Core",
});

export const bootResourceUbuntuSource = define<BootResourceUbuntuSource>({
  keyring_data: "aabbccdd",
  keyring_filename: "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
  source_type: BootResourceSourceType.MAAS_IO,
  url: "http://images.maas.io/ephemeral-v3/stable/",
});

export const bootResourceUbuntuRelease = define<BootResourceUbuntuRelease>({
  checked: false,
  deleted: false,
  name: "xenial",
  title: "16.04 LTS",
  unsupported_arches: () => [],
});

export const bootResourceOtherImage = define<BootResourceOtherImage>({
  checked: false,
  deleted: false,
  name: "centos/amd64/generic/8",
  title: "CentOS 8",
});

export const bootResourceFetchedArch = define<BootResourceFetchedArch>({
  checked: false,
  deleted: false,
  name: "amd64",
  title: "amd64",
});

export const bootResourceFetchedRelease = define<BootResourceFetchedRelease>({
  checked: false,
  deleted: false,
  name: "xenial",
  title: "16.04 LTS",
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
  savingUbuntu: false,
  savingUbuntuCore: false,
  stoppingImport: false,
});
