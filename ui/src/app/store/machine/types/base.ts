import type { DiskTypes, PowerState, StorageLayout } from "./enum";

import type { APIError } from "app/base/types";
import type { CloneError } from "app/machines/components/MachineHeaderForms/ActionFormWrapper/CloneForm/CloneResults/CloneResults";
import type { PowerType } from "app/store/general/types";
import type { Model, ModelRef } from "app/store/types/model";
import type {
  BaseNode,
  NetworkInterface,
  NodeActions,
  TestStatus,
} from "app/store/types/node";
import type { EventError, GenericState } from "app/store/types/state";

export type MachineIpAddress = {
  ip: string;
  is_boot: boolean;
};

export type Vlan = Model & {
  fabric_id: number;
  fabric_name: string;
  name: string;
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

// This is named `MachineEvent` as there is already a DOM `Event` type.
export type MachineEvent = Model & {
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

export type MachineActions = Exclude<NodeActions, NodeActions.IMPORT_IMAGES>;

// BaseMachine is returned from the server when using "machine.list", and is
// used in the machine list. This type is missing some properties due to an
// optimisation on the backend to reduce the amount of database queries on list
// pages.
export type BaseMachine = BaseNode & {
  actions: MachineActions[];
  commissioning_status: TestStatus;
  error_description: string;
  extra_macs: string[];
  fabrics: string[];
  has_logs: boolean;
  ip_addresses?: MachineIpAddress[];
  link_speeds: number[];
  numa_nodes_count: number;
  owner: string;
  physical_disk_count: number;
  pod?: ModelRef;
  pool: ModelRef;
  power_state: PowerState;
  power_type: PowerType["name"];
  pxe_mac_vendor?: string;
  pxe_mac?: string;
  spaces: string[];
  sriov_support: boolean;
  status_message: string;
  storage_tags: string[];
  storage: number;
  subnets: string[];
  testing_status: TestStatus;
  vlan?: Vlan | null;
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
  events: MachineEvent[];
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
    key: Filesystem["fstype"];
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
  cloning: boolean;
  creatingBcache: boolean;
  creatingBond: boolean;
  creatingBridge: boolean;
  creatingCacheSet: boolean;
  creatingLogicalVolume: boolean;
  creatingPartition: boolean;
  creatingPhysical: boolean;
  creatingRaid: boolean;
  creatingVlan: boolean;
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
  gettingSummaryXml: boolean;
  gettingSummaryYaml: boolean;
  linkingSubnet: boolean;
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

export type MachineStatuses = Record<string, MachineStatus>;

export type MachineEventErrors = CloneError;

export type MachineState = {
  active: string | null;
  eventErrors: EventError<Machine, APIError<MachineEventErrors>, "system_id">[];
  selected: Machine["system_id"][];
  statuses: MachineStatuses;
} & GenericState<Machine, APIError>;
