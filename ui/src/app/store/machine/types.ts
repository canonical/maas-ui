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

export type PowerState = "on" | "off" | "unknown" | "error";

export type Machine = BaseNode & {
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

export type MachineStatuses = {
  [x: string]: {
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
};

export type MachineState = {
  errors: TSFixMe;
  items: Machine[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  selected: string[];
  statuses: MachineStatuses;
};
