import { define, extend, random, sequence } from "cooky-cutter";

import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type { Machine } from "app/store/machine/types";
import type { Model } from "app/store/types/model";
import {
  ModelRef,
  BaseNode,
  SimpleNode,
  TestStatus,
} from "app/store/types/node";

const model = define<Model>({
  id: sequence,
});

const modelRef = extend<Model, ModelRef>(model, {
  name: `modelref-${random}`,
});

const testStatus = define<TestStatus>({
  status: 0,
  pending: 0,
  running: 0,
  passed: 0,
  failed: 0,
});

const actions = () => [];
const extra_macs = () => [];
const fabrics = () => [];
const ip_addresses = () => [];
const link_speeds = () => [];
const permissions = () => [];
const service_ids = () => [];
const spaces = () => [];
const storage_tags = () => [];
const subnets = () => [];
const tags = () => ["test"];

const simpleNode = extend<Model, SimpleNode>(model, {
  actions,
  domain: modelRef,
  hostname: `test-machine-${random}`,
  fqdn: "test.maas",
  link_type: "",
  node_type_display: "",
  permissions,
  system_id: random.toString(),
  tags,
});

export const device = extend<SimpleNode, Device>(simpleNode, {
  extra_macs,
  fabrics,
  ip_address: "192.168.1.100",
  ip_assignment: "dynamic",
  link_speeds,
  node_type_display: "Device",
  owner: "admin",
  parent: null,
  primary_mac: "de:ad:be:ef:ba:c1",
  spaces,
  subnets,
  zone: null,
});

const node = extend<SimpleNode, BaseNode>(simpleNode, {
  architecture: "amd64/generic",
  description: "a test node",
  cpu_count: 1,
  cpu_speed: 0,
  cpu_test_status: testStatus,
  distro_series: "",
  interface_test_status: testStatus,
  locked: false,
  memory: 1,
  memory_test_status: testStatus,
  network_test_status: testStatus,
  osystem: "ubuntu",
  other_test_status: testStatus,
  pool: null,
  status: "Allocated",
  status_message: "",
  status_code: 10,
  storage_test_status: testStatus,
});

export const machine = extend<BaseNode, Machine>(node, {
  commissioning_status: testStatus,
  description: "a test machine",
  extra_macs,
  fabrics,
  has_logs: false,
  ip_addresses,
  link_speeds,
  link_type: "machine",
  node_type_display: "Machine",
  numa_nodes_count: 1,
  owner: "admin",
  physical_disk_count: 1,
  pod: null,
  power_state: "on",
  power_type: "manual",
  pxe_mac_vendor: "Unknown vendor",
  pxe_mac: "de:ad:be:ef:aa:b1",
  spaces,
  sriov_support: false,
  storage_tags,
  storage: 8,
  subnets,
  testing_status: testStatus,
  vlan: null,
  zone: null,
});

export const controller = extend<BaseNode, Controller>(node, {
  description: "a test controller",
  last_image_sync: "Thu, 02 Jul. 2020 22:55:00",
  link_type: "controller",
  node_type_display: "Controller",
  node_type: 4,
  service_ids,
  version_long: "2.9.0~alpha1 (8668-g.71d5929ae) (snap)",
  version_short: "2.9.0~alpha1",
  version: "2.9.0~alpha1-8668-g.71d5929ae",
});
