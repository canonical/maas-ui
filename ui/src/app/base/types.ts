export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Choice = [string, string];

export type Sort = {
  direction: "ascending" | "descending" | "none";
  key: string;
};

export type MachineAction = {
  name: string;
  sentence: string;
  title: string;
  type: string;
};

export type PowerField = {
  choices: Choice[];
  default: number | string;
  field_type: "choice" | "mac_address" | "password" | "string";
  label: string;
  name: string;
  required: boolean;
  scope: "bmc" | "node";
};

export type PowerType = {
  chassis: boolean;
  defaults?: {
    cores: number;
    memory: number;
    storage: number;
  };
  description: string;
  driver_type: "pod" | "power";
  fields: PowerField[];
  missing_packages: string[];
  name: string;
  queryable: boolean;
};

export type PowerState = "on" | "off" | "unknown" | "error";

// State
export type RootState = {
  controller: ControllerState;
  machine: MachineState;
  pod: PodState;
  resourcepool: ResourcePoolState;
  user: UserState;
  zone: ZoneState;
};

export type AuthState = {
  errors: TSFixMe;
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  user: User;
};

export type ControllerState = {
  errors: TSFixMe;
  items: Controller[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type MachineState = {
  errors: TSFixMe;
  items: Machine[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  selected: string[];
};

export type PodState = {
  errors: TSFixMe;
  items: Pod[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  selected: number[];
  statuses: {
    [x: number]: {
      deleting: boolean;
      refreshing: boolean;
    };
  };
};

export type ResourcePoolState = {
  errors: TSFixMe;
  items: ResourcePool[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type TestStatus = {
  status: number;
  pending: number;
  running: number;
  passed: number;
  failed: number;
};

export type UserState = {
  auth: AuthState;
  errors: TSFixMe;
  items: User[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type ZoneState = {
  errors: TSFixMe;
  items: Zone[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

// Models
export type Model = {
  id: number;
};

/**
 * A named foreign model reference, e.g. machine.domain
 */
export type ModelRef = Model & {
  name: string;
};

export type Vlan = Model & {
  name: string;
  fabric_id: number;
  fabric_name: string;
};

export type User = Model & {
  completed_intro: boolean;
  email: string;
  global_permissions: string[];
  is_superuser: boolean;
  last_name: string;
  sshkeys_count: number;
  username: string;
};

export type Zone = Model & {
  controllers_count: number;
  created: string;
  description: string;
  devices_count: number;
  machines_count: number;
  name: string;
  updated: string;
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

/**
 * SimpleNode represents the intersection of Devices, Machines and Controllers
 */
export type SimpleNode = Model & {
  actions: string[];
  domain: ModelRef;
  hostname: string;
  fqdn: string;
  link_type: string;
  node_type_display: string;
  permissions: string[];
  system_id: string;
  tags: string[];
};

export type Device = SimpleNode & {
  extra_macs: string[];
  fabrics: string[];
  ip_address?: string;
  ip_assignment: "external" | "dynamic" | "static";
  link_speeds: number[];
  owner: string;
  parent?: string;
  primary_mac: string;
  spaces: string[];
  subnets: string[];
  zone: ModelRef;
};

type NodeStatus =
  | "New"
  | "Commissioning"
  | "Failed commissioning"
  | "Missing"
  | "Ready"
  | "Reserved"
  | "Allocated"
  | "Deploying"
  | "Deployed"
  | "Retired"
  | "Broken"
  | "Failed deployment"
  | "Releasing"
  | "Releasing failed"
  | "Disk erasing"
  | "Failed disk erasing"
  | "Rescue mode"
  | "Entering rescue mode"
  | "Failed to enter rescue mode"
  | "Exiting rescue mode"
  | "Failed to exit rescue mode"
  | "Testing"
  | "Failed testing";

/**
 * Node represents the intersection of Machines and Controllers
 */
export type Node = SimpleNode & {
  architecture: string;
  cpu_count: number;
  cpu_speed: number;
  cpu_test_status: TestStatus;
  description: string;
  distro_series: string;
  interface_test_status: TestStatus;
  locked: boolean;
  memory: number;
  memory_test_status: TestStatus;
  network_test_status: TestStatus;
  osystem: string;
  other_test_status: TestStatus;
  pool?: ModelRef;
  status: NodeStatus;
  status_message: string;
  status_code: number;
  storage_test_status: TestStatus;
};

type IpAddresses = {
  ip: string;
  is_boot: boolean;
};

export type Machine = Node & {
  commissioning_status: TestStatus;
  extra_macs: string[];
  fabrics: string[];
  has_logs: boolean;
  ip_addresses: IpAddresses[];
  link_speeds: number[];
  numa_nodes_count: number;
  owner: string;
  physical_disk_count: number;
  pod?: ModelRef;
  power_state: PowerState;
  power_type: string;
  pxe_mac_vendor: string;
  pxe_mac: string;
  spaces: string[];
  sriov_support: boolean;
  storage_tags: string[];
  storage: number;
  subnets: string[];
  testing_status: TestStatus;
  vlan: Vlan;
  zone: ModelRef;
};

export type Controller = Node & {
  last_image_sync: string;
  node_type: number; // TODO: it seems odd that this is only exposed for controller
  service_ids: number[];
  version_long: string;
  version_short: string;
  version: string;
};

export type Host = Machine | Controller;

/**
 * Type guard to determine if host is a machine.
 * @param {Host} host - a machine or controller.
 */
export const isMachine = (host: Host): host is Machine =>
  (host as Machine).link_type === "machine";

export type ResourcePool = Model & {
  created: string;
  description: string;
  is_default: boolean;
  machine_ready_count: number;
  machine_total_count: number;
  name: string;
  permissions: string[];
  updated: string;
};
