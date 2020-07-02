import { define, extend, random, sequence } from "cooky-cutter";

import { Controller, Machine, Model, TestStatus } from "app/base/types";

const model = define<Model>({
  id: sequence,
});

const testStatus = define<TestStatus>({
  status: 1,
  pending: 0,
  running: 0,
  passed: 1,
  failed: 0,
});

// TODO: these factory functions should be fleshed out and typed
const actions = () => [];
const extra_macs = () => [];
const fabrics = () => [];
const ip_addresses = () => [];
const link_speeds = () => [];
const permissions = () => [];
const spaces = () => [];
const service_ids = () => [];
const storage_tags = () => [];
const subnets = () => [];
const tags = () => ["test"];

export const machine = extend<Model, Machine>(model, {
  actions,
  architecture: "amd64/generic",
  commissioning_status: testStatus,
  cpu_count: 1,
  cpu_speed: 0,
  cpu_test_status: testStatus,
  description: "a test machine",
  distro_series: "",
  domain: null,
  extra_macs,
  fabrics,
  fqdn: "test.maas",
  has_logs: false,
  hostname: "test-machine",
  interface_test_status: testStatus,
  ip_addresses,
  link_speeds,
  link_type: "machine",
  locked: false,
  memory_test_status: testStatus,
  memory: 1,
  network_test_status: testStatus,
  node_type_display: "Machine",
  numa_nodes_count: 1,
  osystem: "ubuntu",
  other_test_status: testStatus,
  owner: "admin",
  permissions,
  physical_disk_count: 1,
  pod: null,
  pool: null,
  power_state: "on",
  power_type: "manual",
  pxe_mac_vendor: "Unknown vendor",
  pxe_mac: "de:ad:be:ef:aa:b1",
  spaces,
  sriov_support: false,
  status_code: 10,
  status_message: "",
  status: "Allocated",
  storage_tags,
  storage_test_status: testStatus,
  storage: 8,
  subnets,
  system_id: random.toString(),
  tags,
  testing_status: testStatus,
  vlan: null,
  zone: null,
});

export const controller = extend<Model, Controller>(model, {
  actions,
  architecture: "amd64/generic",
  cpu_count: 1,
  cpu_speed: 0,
  cpu_test_status: testStatus,
  description: "a test machine",
  distro_series: "",
  domain: null,
  fqdn: "test.maas",
  hostname: "test-controller",
  interface_test_status: testStatus,
  last_image_sync: "Thu, 02 Jul. 2020 22:55:00",
  link_type: "machine",
  locked: false,
  memory_test_status: testStatus,
  memory: 1,
  network_test_status: testStatus,
  node_type_display: "Controller",
  node_type: 4,
  osystem: "ubuntu",
  other_test_status: testStatus,
  permissions,
  pool: null,
  service_ids,
  status_code: 6,
  status_message: "",
  status: "Deployed",
  storage_test_status: testStatus,
  system_id: random.toString(),
  tags,
  version_long: "2.9.0~alpha1 (8668-g.71d5929ae) (snap)",
  version_short: "2.9.0~alpha1",
  version: "2.9.0~alpha1-8668-g.71d5929ae",
});
