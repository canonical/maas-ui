import type { APIError } from "app/base/types";
import type { Pod, PodPowerParameters } from "app/store/pod/types";
import type { ResourcePool } from "app/store/resourcepool/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
import type { Zone } from "app/store/zone/types";

export type VMClusterResource = {
  total: number;
  free: number;
};
export type VMClusterResourcesMemory = {
  hugepages: VMClusterResource;
  general: VMClusterResource;
};

export type VMClusterResources = {
  cpu: VMClusterResource;
  memory: VMClusterResourcesMemory;
  storage: VMClusterResource;
  storage_pools: Record<string, VMClusterResource>;
  vm_count: number;
};

export type VMHost = Model & {
  name: Pod["name"];
  project: PodPowerParameters["project"];
  tags: Pod["tags"];
  resource_pool: ResourcePool["name"];
  availability_zone: Zone["name"];
};

export type VirtualMachine = Model & {
  name: string;
  project: string;
};

export type VMCluster = Model & {
  name: string;
  project: string;
  hosts: VMHost[];
  total_resources: VMClusterResources;
  virtual_machines: VirtualMachine[];
};

export type VMClusterState = GenericState<VMCluster[], APIError>;
