import { array, define, extend, random } from "cooky-cutter";

import { model } from "./model";
import type { Model } from "app/store/types/model";
import type {
  Subnet,
  SubnetStatistics,
  SubnetStatisticsRange,
} from "app/store/subnet/types";

export const subnetStatisticsRange = define<SubnetStatisticsRange>({
  end: "172.16.2.1",
  num_addresses: random,
  purpose: () => [],
  start: "172.16.2.1",
});

export const subnetStatistics = define<SubnetStatistics>({
  available_string: "99%",
  first_address: "172.16.1.1",
  ip_version: random,
  largest_available: random,
  last_address: "172.16.1.254",
  num_available: random,
  num_unavailable: random,
  ranges: array(subnetStatisticsRange),
  suggested_dynamic_range: subnetStatisticsRange,
  suggested_gateway: null,
  total_addresses: random,
  usage_string: "1%",
  usage: random,
});

export const subnet = extend<Model, Subnet>(model, {
  active_discovery: false,
  allow_dns: false,
  allow_proxy: false,
  cidr: "172.16.1.0/24",
  created: "Wed, 08 Jul. 2020 05:35:4",
  description: "test description",
  dns_servers: "fd89:8724:81f1:5512:557f:99c3:6967:8d63",
  gateway_ip: null,
  managed: false,
  name: "test-name",
  rdns_mode: random,
  space: null,
  statistics: subnetStatistics,
  updated: "Wed, 08 Jul. 2020 05:35:4",
  version: random,
  vlan: random,
});
