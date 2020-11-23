import type { Model, ModelRef } from "app/store/types/model";
import type { BaseNode, TestStatus } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

import type { TSFixMe } from "app/base/types";
import type { Subnet } from "app/store/subnet/types";

export type IpAddresses = {
  ip: string;
  is_boot: boolean;
};

export type Vlan = Model & {
  fabric_id: number;
  fabric_name: string;
  name: string;
};

export type NetworkLink = Model & {
  mode: "auto" | "dhcp" | "link_up" | "static";
  subnet: Subnet;
};

export type DiscoveredIP = {
  ip_address: string;
  subnet_id: number;
};

export type NetworkInterface = Model & {
  children: string[];
  discovered?: DiscoveredIP[]; // Only shown when machine is in ephemeral state.
  enabled: boolean;
  firmware_version: string | null;
  interface_speed: number;
  is_boot: boolean;
  link_connected: boolean;
  link_speed: number;
  links: NetworkLink[];
  mac_address: string;
  name: string;
  numa_node: number;
  params: string;
  parents: string[];
  product: string | null;
  sriov_max_vf: number;
  tags: string[];
  type: string;
  vendor: string | null;
  vlan_id: number;
};

export type Filesystem = Model & {
  fstype: string;
  is_format_fstype: boolean;
  label: string;
  mount_options: string | null;
  mount_point: string;
  used_for: string;
};

export type Partition = Model & {
  filesystem: Filesystem | null;
  name: string;
  path: string;
  size_human: string;
  size: number;
  tags: string[];
  type: string;
  used_for: string;
};

export type Disk = Model & {
  available_size_human: string;
  available_size: number;
  block_size: number;
  filesystem: Filesystem | null;
  firmware_version: string;
  is_boot: boolean;
  model: string;
  name: string;
  numa_node?: number;
  numa_nodes?: number[];
  parent?: {
    id: number;
    uuid: string;
    type: string;
  };
  partition_table_type: string;
  partitions: Partition[] | null;
  path: string;
  serial: string;
  size_human: string;
  size: number;
  tags: string[];
  test_status: number;
  type: string;
  used_for: string;
  used_size_human: string;
  used_size: number;
};

export type EventType = Model & {
  description: string;
  level: string;
  name: string;
};

export type Event = Model & {
  created: string;
  description: string;
  type: EventType;
};

export type MachineDevice = {
  fqdn: string;
  interfaces: NetworkInterface[];
};

// Machine metadata is dynamic and depends on the specific hardware.
export type MachineMetadata = {
  chassis_serial?: string;
  chassis_type?: string;
  chassis_vendor?: string;
  chassis_version?: string;
  cpu_model?: string;
  mainboard_firmware_date?: string;
  mainboard_firmware_vendor?: string;
  mainboard_firmware_version?: string;
  mainboard_product?: string;
  mainboard_serial?: string;
  mainboard_vendor?: string;
  mainboard_version?: string;
  system_family?: string;
  system_product?: string;
  system_serial?: string;
  system_sku?: string;
  system_vendor?: string;
  system_version?: string;
};

export type MachineNumaNode = {
  cores: number[];
  hugepages_set: {
    page_size: number;
    total: number;
  }[];
  index: number;
  memory: number;
};

// Power parameters are dynamic and depend on the power type of the node.
export type PowerParameters = {
  blade_id?: string;
  cipher_suite_id?: string;
  instance_name?: string;
  k_g?: string;
  lpar?: string;
  mac_address?: string;
  node_id?: string;
  node_outlet?: string;
  nova_id?: string;
  os_authurl?: string;
  os_password?: string;
  os_tenantname?: string;
  os_username?: string;
  outlet_id?: string;
  password?: string;
  power_address?: string;
  power_boot_type?: string;
  power_control?: string;
  power_driver?: string;
  power_hwaddress?: string;
  power_id?: string;
  power_on_delay?: string;
  power_pass?: string;
  power_port?: string;
  power_protocol?: string;
  power_user?: string;
  power_uuid?: string;
  power_vm_name?: string;
  privilege_level?: string;
  server_name?: string;
  uuid?: string;
};

export type PowerState = "on" | "off" | "unknown" | "error";

// BaseMachine is returned from the server when using "machine.list", and is
// used in the machine list. This type is missing some properties due to an
// optimisation on the backend to reduce the amount of database queries on list
// pages.
export type BaseMachine = BaseNode & {
  commissioning_status: TestStatus;
  error_description: string;
  extra_macs: string[];
  fabrics: string[];
  has_logs: boolean;
  ip_addresses: IpAddresses[];
  link_speeds: number[];
  numa_nodes_count: number;
  owner: string;
  physical_disk_count: number;
  pod?: ModelRef;
  pool: ModelRef;
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
  vlan: Vlan | null;
  zone: ModelRef;
};

// MachineDetails is returned from the server when using "machine.get", and is
// used in the machine details pages. This type contains all possible properties
// of a machine model.
export type MachineDetails = BaseMachine & {
  bios_boot_method: string;
  bmc: number;
  boot_disk: Disk | null;
  cpu_test_status: TestStatus;
  created: string;
  current_commissioning_script_set: number;
  current_installation_script_set: number;
  current_testing_script_set: number;
  detected_storage_layout: "bcache" | "blank" | "flat" | "lvm" | "vmfs6";
  devices: MachineDevice[];
  dhcp_on: boolean;
  disks: Disk[];
  error_description: string;
  error: string;
  events: Event[];
  grouped_storages: {
    count: number;
    disk_type: string;
    size: number;
  }[];
  hardware_uuid: string;
  hwe_kernel: string;
  installation_status: number;
  interface_test_status: TestStatus;
  interfaces: NetworkInterface[];
  license_key: string;
  memory_test_status: TestStatus;
  metadata: MachineMetadata;
  min_hwe_kernel: string;
  network_test_status: TestStatus;
  node_type: number;
  numa_nodes: MachineNumaNode[];
  on_network: boolean;
  other_test_status: TestStatus;
  power_bmc_node_count: number;
  power_parameters: PowerParameters;
  show_os_info: boolean;
  special_filesystems: Filesystem[];
  storage_layout_issues: string[];
  storage_test_status: TestStatus;
  supported_filesystems: {
    key: string;
    ui: string;
  }[];
  swap_size: number | null;
  updated: string;
};

// Depending on where the user has navigated in the app, machines in state can
// either be of type BaseMachine or MachineDetails.
export type Machine = BaseMachine | MachineDetails;

export type MachineStatus = {
  aborting: boolean;
  acquiring: boolean;
  applyingStorageLayout: boolean;
  checkingPower: boolean;
  commissioning: boolean;
  deleting: boolean;
  deploying: boolean;
  enteringRescueMode: boolean;
  exitingRescueMode: boolean;
  locking: boolean;
  markingBroken: boolean;
  markingFixed: boolean;
  mountingSpecial: boolean;
  overridingFailedTesting: boolean;
  releasing: boolean;
  settingPool: boolean;
  settingZone: boolean;
  tagging: boolean;
  testing: boolean;
  turningOff: boolean;
  turningOn: boolean;
  unlocking: boolean;
};

export type MachineStatuses = {
  [x: string]: MachineStatus;
};

export type MachineState = {
  active: string | null;
  selected: Machine["system_id"][];
  statuses: MachineStatuses;
} & GenericState<Machine, TSFixMe>;
