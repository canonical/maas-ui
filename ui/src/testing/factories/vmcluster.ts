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
  VMHost,
} from "app/store/vmcluster/types";

export const vmHost = extend<Model, VMHost>(model, {
  name: "podA",
  project: "my-project",
  tags: () => [],
  resource_pool: "default",
  availability_zone: "default",
});

export const virtualMachine = extend<Model, VirtualMachine>(model, {
  name: "my-virtual-machine",
  project: "my-project",
});

export const vmClusterResource = define<VMClusterResource>({
  free: random,
  total: random,
});
export const vmClusterResourcesMemory = define<VMClusterResourcesMemory>({
  hugepages: vmClusterResource,
  general: vmClusterResource,
});

export const vmClusterResources = define<VMClusterResources>({
  cpu: vmClusterResource,
  memory: vmClusterResourcesMemory,
  storage: vmClusterResource,
  storage_pools: () => ({}),
  vm_count: random,
});

export const vmCluster = extend<Model, VMCluster>(model, {
  name: "clusterA",
  project: "my-project",
  hosts: () => [],
  total_resources: vmClusterResources,
  virtual_machines: () => [],
});

export const vmClusterEventError = define<VMClusterEventError>({
  error: "Uh oh",
  event: "listByPhysicalCluster",
});
