import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { Node } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

export enum PodType {
  LXD = "lxd",
  VIRSH = "virsh",
}

export type PodHint = {
  cores: number;
  local_storage: number;
  local_storage_gb: string;
  memory: number;
  memory_gb: string;
};

export type PodHintExtras = {
  cpu_speed: number;
  iscsi_storage: number;
  iscsi_storage_gb: string;
  local_disks: number;
};

export type PodStoragePool = {
  available: number;
  id: string;
  name: string;
  path: string;
  total: number;
  type: string;
  used: number;
};

// TODO: Remove when resources key fully implemented
export type NumaResource<T> = {
  allocated: T;
  free: T;
};

// TODO: Remove when resources key fully implemented
export type NumaInterface = {
  id: number;
  name: string;
  virtual_functions?: NumaResource<number>;
};

// TODO: Remove when resources key fully implemented
export type NumaVM = {
  networks: {
    guest_nic_id: number;
    host_nic_id: number;
  };
  pinned_cores: number[];
  system_id: string;
};

// TODO: Remove when resources key fully implemented
export type PodNumaNode = {
  cores: NumaResource<number[]>;
  interfaces: NumaInterface[];
  memory: {
    hugepages: (NumaResource<number> & { page_size: number })[];
    general: NumaResource<number>;
  };
  node_id: number;
  vms: NumaVM[];
};

export type PodResource = {
  allocated_other: number;
  allocated_tracked: number;
  free: number;
};

export type PodMemoryResource = {
  hugepages: PodResource;
  general: PodResource;
};

export type PodNetworkInterface = Model & {
  name: string;
  numa_index: PodNuma["node_id"];
  virtual_functions: PodResource;
};

export type PodVM = Model & {
  hugepages_backed: boolean;
  memory: number;
  pinned_cores: number[];
  system_id: Node["system_id"];
  unpinned_cores: number;
};

export type PodNumaResource<T> = {
  allocated: T;
  free: T;
};

export type PodNumaHugepageMemory = PodNumaResource<number> & {
  page_size: number;
};

export type PodNumaMemory = {
  hugepages: PodNumaHugepageMemory[];
  general: PodNumaResource<number>;
};

export type PodNuma = {
  cores: PodNumaResource<number[]>;
  memory: PodNumaMemory;
  interfaces: PodNetworkInterface["id"][];
  node_id: number;
  vms: PodVM["id"][];
};

export type PodResources = {
  cores: PodResource;
  interfaces: PodNetworkInterface[];
  memory: PodMemoryResource;
  numa: PodNuma[];
  vms: PodVM[];
};

export type LxdServerGroup = {
  address: Pod["power_address"];
  pods: Pod[];
};

// BasePod is returned from the server when using "pod.list", and is used in the
// pod list pages. This type is missing some properties due to an optimisation
// on the backend to reduce the amount of database queries on list pages.
export type BasePod = Model & {
  architectures: string[];
  available: PodHint;
  capabilities: string[];
  composed_machines_count: number;
  cpu_over_commit_ratio: number;
  cpu_speed: number;
  created: string;
  default_macvlan_mode: string;
  default_storage_pool: string | null;
  hints: PodHint & PodHintExtras;
  host: string | null;
  ip_address: number | string;
  memory_over_commit_ratio: number;
  name: string;
  // TODO: Remove when resources key fully implemented
  numa_pinning?: PodNumaNode[];
  password?: string;
  permissions: string[];
  pool: number;
  power_address: string;
  power_pass?: string;
  // Only LXD pods have the project parameter.
  project?: string;
  resources: PodResources;
  owners_count: number;
  storage_pools: PodStoragePool[];
  tags: string[];
  total: PodHint;
  type: PodType;
  updated: string;
  used: PodHint;
  version: string;
  zone: number;
};

// PodDetails is returned from the server when using "pod.get", and is used in the
// pod details pages. This type contains all possible properties of a pod model.
export type PodDetails = BasePod & {
  attached_vlans: number[];
  boot_vlans: number[];
};

// Depending on where the user has navigated in the app, pods in state can
// either be of type Pod or PodDetails.
export type Pod = BasePod | PodDetails;

export type PodStatus = {
  composing: boolean;
  deleting: boolean;
  refreshing: boolean;
};

export type PodStatuses = {
  [x: number]: PodStatus;
};

export type PodProject = {
  description: string;
  name: string;
};

export type PodProjects = {
  [x: string]: PodProject[];
};

export type PodState = {
  active: number | null;
  projects: PodProjects;
  statuses: PodStatuses;
} & GenericState<Pod, TSFixMe>;
