import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
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

export type Subnet = Model & {
  active_discovery: boolean;
  allow_dns: boolean;
  allow_proxy: boolean;
  cidr: string;
  created: string;
  description: string;
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

export type SubnetState = GenericState<Subnet, TSFixMe>;
