import type { IPAddressType, SubnetMeta } from "./enum";

import type { APIError } from "app/base/types";
import type { Domain } from "app/store/domain/types";
import type { Architecture } from "app/store/general/types";
import type { Pod } from "app/store/pod/types";
import type { Model } from "app/store/types/model";
import type { NetworkInterface, Node, NodeType } from "app/store/types/node";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";
import type { VLAN } from "app/store/vlan/types";

export type SubnetStatisticsRange = {
  end: string;
  num_addresses: number;
  purpose: string[];
  start: string;
};

export type SubnetStatistics = {
  available_string: string;
  first_address: string;
  ip_version: number;
  largest_available: number;
  last_address: string;
  num_available: number;
  num_unavailable: number;
  ranges: SubnetStatisticsRange[];
  suggested_dynamic_range: SubnetStatisticsRange;
  suggested_gateway: string | null;
  total_addresses: number;
  usage_string: string;
  usage: number;
};

export type SubnetBMCNode = {
  hostname: Node["hostname"];
  system_id: Node["system_id"];
};

export type SubnetBMC = Model & {
  nodes: SubnetBMCNode[];
  power_type: Pod["type"];
};

export type SubnetDNSRecord = Model & {
  domain: Domain["name"];
  name: string;
};

export type SubnetIPNodeSummary = {
  fqdn: Node["fqdn"];
  hostname: Node["hostname"];
  is_container: boolean;
  node_type: NodeType;
  system_id: Node["system_id"];
  via?: NetworkInterface["name"];
};

export type SubnetIP = {
  alloc_type: IPAddressType;
  bmcs?: SubnetBMC[];
  created: string;
  dns_records?: SubnetDNSRecord[];
  ip: string;
  node_summary?: SubnetIPNodeSummary;
  updated: string;
  user?: User["username"];
};

export type BaseSubnet = Model & {
  active_discovery: boolean;
  allow_dns: boolean;
  allow_proxy: boolean;
  cidr: string;
  created: string;
  description: string;
  disabled_boot_architectures: Architecture[];
  dns_servers: string;
  gateway_ip: string | null;
  managed: boolean;
  name: string;
  rdns_mode: number;
  space: number | null;
  statistics: SubnetStatistics;
  updated: string;
  version: number;
  vlan: VLAN["id"];
};

export type SubnetDetails = BaseSubnet & {
  ip_addresses: SubnetIP[];
};

export type Subnet = BaseSubnet | SubnetDetails;

export type SubnetState = GenericState<Subnet, APIError> & {
  active: Subnet[SubnetMeta.PK] | null;
};
