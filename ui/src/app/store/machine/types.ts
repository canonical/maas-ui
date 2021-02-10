import type { TSFixMe } from "app/base/types";
import type { Subnet } from "app/store/subnet/types";
import type { Model, ModelRef } from "app/store/types/model";
import type { BaseNode, TestStatus } from "app/store/types/node";
import type { EventError, GenericState } from "app/store/types/state";

export type IpAddresses = {
  ip: string;
  is_boot: boolean;
};

export type Vlan = Model & {
  fabric_id: number;
  fabric_name: string;
  name: string;
};

export enum NetworkLinkMode {
  AUTO = "auto",
  DHCP = "dhcp",
  LINK_UP = "link_up",
  STATIC = "static",
}

export type NetworkLink = Model & {
  ip_address?: string;
  mode: NetworkLinkMode;
  subnet_id: Subnet["id"];
};

export type DiscoveredIP = {
  ip_address: string;
  subnet_id: number;
};

export enum NetworkInterfaceTypes {
  ALIAS = "alias",
  BOND = "bond",
  BRIDGE = "bridge",
  PHYSICAL = "physical",
  VLAN = "vlan",
}

export enum BondMode {
  BALANCE_RR = "balance-rr",
  ACTIVE_BACKUP = "active-backup",
  BALANCE_XOR = "balance-xor",
  BROADCAST = "broadcast",
  LINK_AGGREGATION = "802.3ad",
  BALANCE_TLB = "balance-tlb",
  BALANCE_ALB = "balance-alb",
}

export enum BondLacpRate {
  SLOW = "slow",
  FAST = "fast",
}

export enum BondXmitHashPolicy {
  LAYER2 = "layer2",
  LAYER2_3 = "layer2+3",
  LAYER3_4 = "layer3+4",
  ENCAP2_3 = "encap2+3",
  ENCAP3_4 = "encap3+4",
}

export enum BridgeType {
  STANDARD = "standard",
  OVS = "ovs",
}

export type NetworkInterfaceParams = {
  bridge_type?: BridgeType;
  bridge_stp?: boolean;
  bridge_fd?: number;
  mtu?: number;
  accept_ra?: boolean;
  autoconf?: boolean;
  bond_mode?: BondMode;
  bond_miimon?: number;
  bond_downdelay?: number;
  bond_updelay?: number;
  bond_lacp_rate?: BondLacpRate;
  bond_xmit_hash_policy?: BondXmitHashPolicy;
  bond_num_grat_arp?: number;
};

export type NetworkInterface = Model & {
  children: Model["id"][];
  discovered?: DiscoveredIP[] | null; // Only shown when machine is in ephemeral state.
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
  params: NetworkInterfaceParams | null;
  parents: Model["id"][];
  product: string | null;
  sriov_max_vf: number;
  tags: string[];
  type: NetworkInterfaceTypes;
  vendor: string | null;
  vlan_id: number;
};

export enum StorageLayout {
  BCACHE = "bcache",
  BLANK = "blank",
  FLAT = "flat",
  LVM = "lvm",
  UNKNOWN = "unknown",
  VMFS6 = "vmfs6",
}

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

export enum BcacheModes {
  WRITE_BACK = "writeback",
  WRITE_THROUGH = "writethrough",
  WRITE_AROUND = "writearound",
}

export enum DiskTypes {
  BCACHE = "bcache",
  CACHE_SET = "cache-set",
  ISCSI = "iscsi",
  PHYSICAL = "physical",
  RAID_0 = "raid-0",
  RAID_1 = "raid-1",
  RAID_5 = "raid-5",
  RAID_6 = "raid-6",
  RAID_10 = "raid-10",
  VIRTUAL = "virtual",
  VMFS6 = "vmfs6",
  VOLUME_GROUP = "lvm-vg",
}

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
    type: DiskTypes;
  };
  partition_table_type: string;
  partitions: Partition[] | null;
  path: string;
  serial: string;
  size_human: string;
  size: number;
  tags: string[];
  test_status: number;
  type: DiskTypes;
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

export type MachineNumaNode = Model & {
  cores: number[];
  hugepages_set: {
    page_size: number;
    total: number;
  }[];
  index: number;
  memory: number;
};

// Power parameters are dynamic and depend on the power type of the node.
export type PowerParameters = { [x: string]: string | number };

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
  workload_annotations: { [x: string]: string };
  zone: ModelRef;
};

// MachineDetails is returned from the server when using "machine.get", and is
// used in the machine details pages. This type contains all possible properties
// of a machine model.
export type MachineDetails = BaseMachine & {
  bios_boot_method: string;
  bmc: number;
  boot_disk: Disk | null;
  commissioning_start_time: string;
  cpu_test_status: TestStatus;
  created: string;
  current_commissioning_script_set: number;
  current_installation_script_set: number;
  current_testing_script_set: number;
  detected_storage_layout: StorageLayout;
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
  installation_start_time: string;
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
  testing_start_time: string;
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
  creatingBcache: boolean;
  creatingCacheSet: boolean;
  creatingLogicalVolume: boolean;
  creatingPartition: boolean;
  creatingRaid: boolean;
  creatingVmfsDatastore: boolean;
  creatingVolumeGroup: boolean;
  commissioning: boolean;
  deleting: boolean;
  deletingCacheSet: boolean;
  deletingDisk: boolean;
  deletingFilesystem: boolean;
  deletingInterface: boolean;
  deletingPartition: boolean;
  deletingVolumeGroup: boolean;
  deploying: boolean;
  enteringRescueMode: boolean;
  exitingRescueMode: boolean;
  locking: boolean;
  markingBroken: boolean;
  markingFixed: boolean;
  mountingSpecial: boolean;
  overridingFailedTesting: boolean;
  releasing: boolean;
  settingBootDisk: boolean;
  settingPool: boolean;
  settingZone: boolean;
  tagging: boolean;
  testing: boolean;
  turningOff: boolean;
  turningOn: boolean;
  unlocking: boolean;
  unlinkingSubnet: boolean;
  unmountingSpecial: boolean;
  updatingDisk: boolean;
  updatingFilesystem: boolean;
  updatingInterface: boolean;
  updatingVmfsDatastore: boolean;
};

export type MachineStatuses = {
  [x: string]: MachineStatus;
};

export type MachineState = {
  active: string | null;
  eventErrors: EventError<Machine, TSFixMe, "system_id">[];
  selected: Machine["system_id"][];
  statuses: MachineStatuses;
} & GenericState<Machine, TSFixMe>;
