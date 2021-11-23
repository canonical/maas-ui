import type {
  BridgeType,
  NetworkInterfaceTypes,
  NetworkLinkMode,
} from "./enum";

import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type {
  BondLacpRate,
  BondMode,
  BondXmitHashPolicy,
} from "app/store/general/types";
import type { Machine } from "app/store/machine/types";
import type { Subnet } from "app/store/subnet/types";
import type { Model, ModelRef } from "app/store/types/model";

export enum NodeType {
  DEFAULT = 0,
  MACHINE = 0,
  DEVICE = 1,
  RACK_CONTROLLER = 2,
  REGION_CONTROLLER = 3,
  REGION_AND_RACK_CONTROLLER = 4,
}

export enum NodeTypeDisplay {
  DEVICE = "Device",
  MACHINE = "Machine",
  RACK_CONTROLLER = "Rack controller",
  REGION_AND_RACK_CONTROLLER = "Region and rack controller",
  REGION_CONTROLLER = "Region controller",
}

export enum NodeLinkType {
  CONTROLLER = "controller",
  DEVICE = "device",
  MACHINE = "machine",
}

export enum NodeStatusCode {
  // The node has been created and has a system ID assigned to it.
  NEW = 0,
  // Testing and other commissioning steps are taking place.
  COMMISSIONING = 1,
  // The commissioning step failed.
  FAILED_COMMISSIONING = 2,
  // The node can't be contacted.
  MISSING = 3,
  // The node is in the general pool ready to be deployed.
  READY = 4,
  // The node is ready for named deployment.
  RESERVED = 5,
  // The node has booted into the operating system of its owner's choice
  // and is ready for use.
  DEPLOYED = 6,
  // The node has been removed from service manually until an admin
  // overrides the retirement.
  RETIRED = 7,
  // The node is broken: a step in the node lifecycle failed.
  // More details can be found in the node's event log.
  BROKEN = 8,
  // The node is being installed.
  DEPLOYING = 9,
  // The node has been allocated to a user and is ready for deployment.
  ALLOCATED = 10,
  // The deployment of the node failed.
  FAILED_DEPLOYMENT = 11,
  // The node is powering down after a release request.
  RELEASING = 12,
  // The releasing of the node failed.
  FAILED_RELEASING = 13,
  // The node is erasing its disks.
  DISK_ERASING = 14,
  // The node failed to erase its disks.
  FAILED_DISK_ERASING = 15,
  // The node is in rescue mode.
  RESCUE_MODE = 16,
  // The node is entering rescue mode.
  ENTERING_RESCUE_MODE = 17,
  // The node failed to enter rescue mode.
  FAILED_ENTERING_RESCUE_MODE = 18,
  // The node is exiting rescue mode.
  EXITING_RESCUE_MODE = 19,
  // The node failed to exit rescue mode.
  FAILED_EXITING_RESCUE_MODE = 20,
  // Running tests on Node
  TESTING = 21,
  // Testing has failed
  FAILED_TESTING = 22,
}

export enum NodeStatus {
  ALLOCATED = "Allocated",
  BROKEN = "Broken",
  COMMISSIONING = "Commissioning",
  DEPLOYED = "Deployed",
  DEPLOYING = "Deploying",
  DISK_ERASING = "Disk erasing",
  ENTERING_RESCUE_MODE = "Entering rescue mode",
  EXITING_RESCUE_MODE = "Exiting rescue mode",
  FAILED_COMMISSIONING = "Failed commissioning",
  FAILED_DEPLOYMENT = "Failed deployment",
  FAILED_DISK_ERASING = "Failed disk erasing",
  FAILED_ENTERING_RESCUE_MODE = "Failed to enter rescue mode",
  FAILED_EXITING_RESCUE_MODE = "Failed to exit rescue mode",
  FAILED_RELEASING = "Releasing failed",
  FAILED_TESTING = "Failed testing",
  MISSING = "Missing",
  NEW = "New",
  READY = "Ready",
  RELEASING = "Releasing",
  RESCUE_MODE = "Rescue mode",
  RESERVED = "Reserved",
  RETIRED = "Retired",
  TESTING = "Testing",
}

export enum NodeActions {
  ABORT = "abort",
  ACQUIRE = "acquire",
  CLONE = "clone",
  COMMISSION = "commission",
  DELETE = "delete",
  DEPLOY = "deploy",
  EXIT_RESCUE_MODE = "exit-rescue-mode",
  IMPORT_IMAGES = "import-images",
  LOCK = "lock",
  MARK_BROKEN = "mark-broken",
  MARK_FIXED = "mark-fixed",
  OFF = "off",
  ON = "on",
  OVERRIDE_FAILED_TESTING = "override-failed-testing",
  RELEASE = "release",
  RESCUE_MODE = "rescue-mode",
  SET_POOL = "set-pool",
  SET_ZONE = "set-zone",
  TAG = "tag",
  TEST = "test",
  UNLOCK = "unlock",
}

export enum TestStatusStatus {
  NONE = -1,
  PENDING = 0,
  RUNNING = 1,
  PASSED = 2,
  FAILED = 3,
}

export type TestStatus = {
  status: TestStatusStatus;
  pending: number;
  running: number;
  passed: number;
  failed: number;
};

/**
 * SimpleNode represents the intersection of Devices, Machines and Controllers
 */
export type SimpleNode = Model & {
  domain: ModelRef;
  hostname: string;
  fqdn: string;
  permissions: string[];
  system_id: string;
  tags: string[];
};

/**
 * BaseNode represents the intersection of Machines and Controllers
 */
export type BaseNode = SimpleNode & {
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
  status_code: NodeStatusCode;
  storage_test_status: TestStatus;
};

export type Node = Controller | Device | Machine;

export type NetworkLink = Model & {
  ip_address?: string;
  mode: NetworkLinkMode;
  subnet_id: Subnet["id"];
};

export type DiscoveredIP = {
  ip_address: string;
  subnet_id: number;
};

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
