import { define, extend } from "cooky-cutter";

import { model } from "./model";

import type {
  BootResource,
  BootResourceEventError,
  BootResourceOtherImage,
  BootResourceStatuses,
  BootResourceUbuntu,
  BootResourceUbuntuCoreImage,
} from "app/store/bootresource/types";
import { BootResourceAction } from "app/store/bootresource/types";
import type { Model } from "app/store/types/model";

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
  numberOfNodes: 0,
  lastUpdate: "Tue, 08 Jun. 2021 02:12:47",
});

export const bootResourceUbuntu = define<BootResourceUbuntu>({
  arches: () => [],
  commissioning_series: "focal",
  releases: () => [],
  sources: () => [],
});

export const bootResourceUbuntuCoreImage = define<BootResourceUbuntuCoreImage>({
  checked: false,
  deleted: false,
  name: "ubuntu/core",
  title: "Ubuntu Core",
});

export const bootResourceOtherImage = define<BootResourceOtherImage>({
  checked: false,
  deleted: false,
  name: "centos/amd64/generic/8",
  title: "CentOS 8",
});

export const bootResourceEventError = define<BootResourceEventError>({
  error: "Poll failed",
  event: BootResourceAction.POLL,
});

export const bootResourceStatuses = define<BootResourceStatuses>({
  poll: false,
});
