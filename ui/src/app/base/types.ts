export type Choice = [string, string];

export type Controller = {
  actions: string[];
  architecture: string;
  cpu_count: number;
  cpu_speed: number;
  cpu_test_status: TestStatus;
  description: string;
  distro_series: string;
  domain: TSFixMe;
  fqdn: string;
  hostname: string;
  id: number;
  interface_test_status: TestStatus;
  last_image_sync: string;
  link_type: string;
  locked: boolean;
  memory_test_status: TestStatus;
  memory: number;
  network_test_status: TestStatus;
  node_type_display: string;
  node_type: number;
  osystem: string;
  other_test_status: TestStatus;
  permissions: string[];
  pool: ResourcePool | null;
  service_ids: number[];
  status_code: number;
  status_message: string;
  status: string;
  storage_test_status: TestStatus;
  system_id: string;
  tags: string[];
  version_long: string;
  version_short: string;
  version: string;
};

export type ControllerState = {
  errors: TSFixMe;
  items: Controller[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};

export type Machine = {
  actions: string[];
  architecture: string;
  commissioning_status: TestStatus;
  cpu_count: 1;
  cpu_speed: 0;
  cpu_test_status: TestStatus;
  description: string;
  distro_series: string;
  domain: TSFixMe;
  extra_macs: string[];
  fabrics: string[];
  fqdn: string;
  has_logs: boolean;
  hostname: string;
  id: number;
  interface_test_status: TestStatus;
  ip_addresses: string[];
  link_speeds: number[];
  link_type: string;
  locked: boolean;
  memory_test_status: TestStatus;
  memory: 1;
  network_test_status: TestStatus;
  node_type_display: string;
  numa_nodes_count: number;
  osystem: string;
  other_test_status: TestStatus;
  owner: string;
  permissions: string[];
  physical_disk_count: number;
  pod: TSFixMe;
  pool: TSFixMe;
  power_state: string;
  power_type: string;
  pxe_mac_vendor: string;
  pxe_mac: string;
  spaces: string[];
  sriov_support: boolean;
  status_code: number;
  status_message: string;
  status: string;
  storage_tags: string[];
  storage_test_status: TestStatus;
  storage: number;
  subnets: string[];
  system_id: string;
  tags: string[];
  testing_status: TestStatus;
  vlan: TSFixMe;
  zone: TSFixMe;
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

export type TestStatus = {
  status: number;
  pending: number;
  running: number;
  passed: number;
  failed: number;
};

export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
