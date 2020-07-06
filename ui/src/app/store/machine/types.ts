import type { BaseNode } from "app/store/node/types";
import type { Model } from "app/store/types";
import type { ModelRef, TestStatus } from "app/store/node/types";
import type { TSFixMe } from "app/base/types";

export type MachineAction = {
  name: string;
  sentence: string;
  title: string;
  type: string;
};

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
  vlan: Vlan;
  zone: ModelRef;
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
