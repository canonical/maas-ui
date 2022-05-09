import { define, extend, random } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";
import type {
  VirtualMachine,
  VMCluster,
  VMClusterEventError,
  VMClusterResource,
  VMClusterResources,
  VMClusterResourcesMemory,
  VMClusterStoragePoolResource,
  VMHost,
} from "app/store/vmcluster/types";

export const vmHost = extend<Model, VMHost>(model, {
  availability_zone: "default",
  name: "podA",
  project: "my-project",
  resource_pool: "default",
  tags: () => [],
});

export const virtualMachine = define<VirtualMachine>({
  hugepages_backed: false,
  name: "my-virtual-machine",
  pinned_cores: () => [],
  project: "my-project",
  system_id: "abc123",
  unpinned_cores: 0,
});

export const vmClusterStoragePoolResource =
  define<VMClusterStoragePoolResource>({
    allocated_other: random,
    allocated_tracked: random,
    backend: "zfs",
    free: random,
    path: "/path",
    total: random,
  });

export const vmClusterResource = define<VMClusterResource>({
  allocated_other: random,
  allocated_tracked: random,
  free: random,
  total: random,
});

export const vmClusterResourcesMemory = define<VMClusterResourcesMemory>({
  general: vmClusterResource,
  hugepages: vmClusterResource,
});

export const vmClusterResources = define<VMClusterResources>({
  cpu: vmClusterResource,
  memory: vmClusterResourcesMemory,
  storage: vmClusterResource,
  storage_pools: () => ({}),
  vm_count: random,
});

export const vmCluster = extend<Model, VMCluster>(model, {
  availability_zone: random,
  created_at: "Thu, 15 Aug. 2019 06:21:39",
  hosts: () => [],
  name: "clusterA",
  project: "my-project",
  resource_pool: "",
  total_resources: vmClusterResources,
  updated_at: "Fri, 16 Aug. 2019 11:21:39",
  version: "",
  virtual_machines: () => [],
});

export const vmClusterEventError = define<VMClusterEventError>({
  error: "Uh oh",
  event: "listByPhysicalCluster",
});
