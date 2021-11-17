import type { DeviceIpAssignment } from "./enum";

import type { APIError } from "app/base/types";
import type { ModelRef } from "app/store/types/model";
import type {
  NetworkInterface,
  NodeActions,
  NodeType,
  SimpleNode,
} from "app/store/types/node";
import type { GenericState } from "app/store/types/state";

export type DeviceActions = NodeActions.DELETE | NodeActions.SET_ZONE;

export type DeviceNetworkInterface = NetworkInterface & {
  ip_address: string | null;
  ip_assignment: DeviceIpAssignment;
};

export type Device = SimpleNode & {
  actions: DeviceActions[];
  extra_macs: string[];
  fabrics: string[];
  ip_address: string | null;
  ip_assignment: DeviceIpAssignment | "";
  link_speeds: number[];
  owner: string;
  parent: string | null; // `parent` is a `system_id`
  primary_mac: string;
  spaces: string[];
  subnets: string[];
  zone: ModelRef;
};

export type DeviceDetails = Device & {
  created: string;
  description: string;
  interfaces: DeviceNetworkInterface[];
  locked: boolean;
  node_type: NodeType.DEVICE;
  on_network: boolean;
  pool: ModelRef | null;
  swap_size: number | null;
  updated: string;
};

export type DeviceState = GenericState<Device, APIError>;
