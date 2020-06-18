export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

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

export type Pod = {
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
  id: number;
  ip_address: number | string;
  memory_over_commit_ratio: number;
  name: string;
  permissions: string[];
  pool: number;
  power_address: string;
  power_pass: string;
  owners_count: number;
  storage_pools: TSFixMe[];
  tags: string[];
  total: PodHint;
  type: string;
  updated: string;
  used: PodHint;
  zone: number;
};

export type PodState = {
  errors: TSFixMe;
  items: Pod[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type ResourcePool = {
  created: string;
  description: string;
  id: number;
  is_default: boolean;
  machine_ready_count: number;
  machine_total_count: number;
  name: string;
  permissions: string[];
  updated: string;
};

export type ResourcePoolState = {
  errors: TSFixMe;
  items: ResourcePool[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type Zone = {
  controllers_count: number;
  created: string;
  description: string;
  devices_count: number;
  id: number;
  machines_count: number;
  name: string;
  updated: string;
};

export type ZoneState = {
  errors: TSFixMe;
  items: Zone[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type RootState = {
  pod: PodState;
  resourcepool: ResourcePoolState;
  zone: ZoneState;
};
