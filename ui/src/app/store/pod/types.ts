import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";

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

export type PodStoragePool = Model & {
  available: number;
  name: string;
  path: string;
  total: number;
  type: string;
  used: number;
};

export type Pod = Model & {
  architectures: string[];
  available: PodHint;
  capabilities: string[];
  composed_machines_count: number;
  cpu_over_commit_ratio: number;
  cpu_speed: number;
  created: string;
  default_macvlan_mode: string;
  default_storage_pool: string;
  hints: PodHint & PodHintExtras;
  host: string | null;
  ip_address: number | string;
  memory_over_commit_ratio: number;
  name: string;
  password?: string;
  permissions: string[];
  pool: number;
  power_address: string;
  power_pass?: string;
  owners_count: number;
  storage_pools: PodStoragePool[];
  tags: string[];
  total: PodHint;
  type: string;
  updated: string;
  used: PodHint;
  zone: number;
};

export type PodStatus = {
  composing: boolean;
  deleting: boolean;
  refreshing: boolean;
};

export type PodStatuses = {
  [x: number]: PodStatus;
};

export type PodState = {
  errors: TSFixMe;
  items: Pod[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  selected: Pod["id"][];
  statuses: PodStatuses;
};
