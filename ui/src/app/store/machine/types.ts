import type { BaseNode, TestStatus } from "app/store/types/node";
import type { Model, ModelRef } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

type IpAddresses = {
  ip: string;
  is_boot: boolean;
};

export type Vlan = Model & {
  name: string;
  fabric_id: number;
  fabric_name: string;
};

export type NetworkInterface = Model & {
  children: string[];
  enabled: boolean;
  firmware_version: string;
  interface_speed: number;
  is_boot: boolean;
  link_connected: boolean;
  link_speed: number;
  links: TSFixMe[];
  mac_address: string;
  name: number;
  numa_node: number;
  params: string;
  parents: string[];
  product: string;
  sriov_max_vf: number;
  tags: string[];
  vendor: string;
  vlan_id: number;
};

export type MachineDevice = {
  fqdn: string;
  interfaces: NetworkInterface[];
};

export type PowerState = "on" | "off" | "unknown" | "error";

// BaseMachine is returned from the server when using "machine.list", and is
// used in the machine list. This type is missing some properties due to an
// optimisation on the backend to reduce the amount of database queries on list
// pages.
export type BaseMachine = BaseNode & {
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
  vlan: Vlan | null;
  zone: ModelRef;
};

// MachineDetails is returned from the server when using "machine.get", and is
// used in the machine details pages. This type contains all possible properties
// of a machine model.
export type MachineDetails = BaseMachine & {
  devices: MachineDevice[];
};

// Depending on where the user has navigated in the app, machines in state can
// either be of type BaseMachine or MachineDetails.
export type Machine = BaseMachine | MachineDetails;

export type MachineStatus = {
  aborting: boolean;
  acquiring: boolean;
  checkingPower: boolean;
  commissioning: boolean;
  deleting: boolean;
  deploying: boolean;
  enteringRescueMode: boolean;
  exitingRescueMode: boolean;
  locking: boolean;
  markingBroken: boolean;
  markingFixed: boolean;
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
  errors: TSFixMe;
  items: Machine[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  selected: Machine["system_id"][];
  statuses: MachineStatuses;
};
