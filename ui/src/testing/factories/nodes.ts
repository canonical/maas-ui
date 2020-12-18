import { define, extend, random, sequence } from "cooky-cutter";

import { model, modelRef } from "./model";

import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type {
  DiscoveredIP,
  Disk,
  Event,
  EventType,
  Filesystem,
  Machine,
  MachineDetails,
  MachineDevice,
  MachineNumaNode,
  NetworkInterface,
  NetworkLink,
  Partition,
} from "app/store/machine/types";
import {
  DiskTypes,
  NetworkLinkMode,
  NetworkInterfaceTypes,
} from "app/store/machine/types";
import type {
  Pod,
  PodDetails,
  PodHint,
  PodHintExtras,
  PodNumaNode,
  PodStoragePool,
} from "app/store/pod/types";
import type { Model } from "app/store/types/model";
import type { BaseNode, SimpleNode, TestStatus } from "app/store/types/node";
import { NodeStatus } from "app/store/types/node";

export const testStatus = define<TestStatus>({
  status: 0,
  pending: 0,
  running: 0,
  passed: 0,
  failed: 0,
});

const actions = () => [];
const architectures = () => ["amd64/generic", "i386"];
const extra_macs = () => [];
const capabilities = () => [
  "composable",
  "dynamic_local_storage",
  "over_commit",
  "storage_pools",
];
const fabrics = () => [];
const ip_addresses = () => [];
const link_speeds = () => [];
const permissions = () => ["edit", "delete", "compose"];
const service_ids = () => [];
const spaces = () => [];
const storage_pools = () => [podStoragePool(), podStoragePool()];
const storage_tags = () => [];
const subnets = () => [];
const tags = () => [];
const hints = () => ({ ...podHint(), ...podHintExtras() });

const simpleNode = extend<Model, SimpleNode>(model, {
  actions,
  domain: modelRef,
  hostname: `test-machine-${random}`,
  fqdn: "test.maas",
  link_type: "",
  node_type_display: "",
  permissions,
  system_id: () => random().toString(),
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
  zone: modelRef,
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
  pool: modelRef,
  status: NodeStatus.ALLOCATED,
  status_message: "",
  status_code: 10,
  storage_test_status: testStatus,
});

export const machine = extend<BaseNode, Machine>(node, {
  commissioning_status: testStatus,
  description: "a test machine",
  error_description: "",
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
  pod: modelRef,
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
  zone: modelRef,
});

export const machineNumaNode = define<MachineNumaNode>({
  cores: () => [],
  hugepages_set: () => [],
  index: sequence,
  memory: 256,
});

export const machineEventType = extend<Model, EventType>(model, {
  description: "Script",
  level: "info",
  name: "SCRIPT_DID_NOT_COMPLETE",
});

export const machineEvent = extend<Model, Event>(model, {
  created: "Mon, 19 Oct. 2020 07:04:37",
  description: "smartctl-validate on name-VZJoCN timed out",
  type: machineEventType,
});

export const machineFilesystem = extend<Model, Filesystem>(model, {
  fstype: "fat32",
  is_format_fstype: true,
  label: "efi",
  mount_options: "abc",
  mount_point: "/boot/efi",
  used_for: "fat32 formatted filesystem mounted at /boot/efi",
});

export const machinePartition = extend<Model, Partition>(model, {
  filesystem: null,
  name: "sda-part1",
  path: "/dev/disk/by-dname/sda-part1",
  size_human: "100 GB",
  size: 100000000000,
  tags: () => [],
  type: "partition",
  used_for: "fat32 formatted filesystem mounted at /boot/efi",
});

export const machineDisk = extend<Model, Disk>(model, {
  is_boot: true,
  name: "sda",
  tags: () => [],
  type: DiskTypes.PHYSICAL,
  path: "/dev/disk/by-dname/sda",
  size: 100000000000,
  size_human: "100 GB",
  used_size: 40000000000,
  used_size_human: "40 GB",
  available_size: 60000000000,
  available_size_human: "600 GB",
  block_size: 512,
  model: "QEMU HARDDISK",
  serial: "lxd_root",
  firmware_version: "2.5+",
  partition_table_type: "GPT",
  used_for: "GPT partitioned with 2 partitions",
  filesystem: null,
  partitions: () => [],
  numa_node: 0,
  test_status: 0,
});

export const networkLink = extend<Model, NetworkLink>(model, {
  mode: NetworkLinkMode.AUTO,
  subnet_id: random,
});

export const networkDiscoveredIP = define<DiscoveredIP>({
  ip_address: "1.2.3.4",
  subnet_id: random,
});

export const machineInterface = extend<Model, NetworkInterface>(model, {
  children: () => [],
  discovered: () => [],
  enabled: true,
  firmware_version: "1.0.0",
  interface_speed: 10000,
  is_boot: true,
  link_connected: true,
  link_speed: 10000,
  links: () => [],
  mac_address: "00.00.00.00.00.00",
  name: (i: number) => `eth${i}`,
  numa_node: 0,
  params: null,
  parents: () => [],
  product: "Product",
  sriov_max_vf: 0,
  tags: () => [],
  type: NetworkInterfaceTypes.PHYSICAL,
  vendor: "Vendor",
  vlan_id: 5001,
});

export const machineDevice = define<MachineDevice>({
  fqdn: "device.maas",
  interfaces: () => [],
});

export const machineDetails = extend<Machine, MachineDetails>(machine, {
  bios_boot_method: "uefi",
  bmc: 190,
  boot_disk: null,
  created: "Thu, 15 Oct. 2020 07:25:10",
  current_commissioning_script_set: 6188,
  current_installation_script_set: 6174,
  current_testing_script_set: 6192,
  detected_storage_layout: "flat",
  devices: () => [],
  dhcp_on: false,
  disks: () => [],
  error_description: "",
  error: "",
  events: () => [],
  grouped_storages: () => [],
  hardware_uuid: "F5BB1CC9-45B2-46EA-B96A-7D528A902F4B",
  hwe_kernel: "groovy (ga-20.10)",
  installation_status: 3,
  interfaces: () => [],
  license_key: "",
  metadata: () => ({
    cpu_model: "Intel(R) Xeon(R) CPU E5620",
    system_vendor: "QEMU",
    system_product: "Standard PC (Q35 + ICH9, 2009)",
    system_version: "pc-q35-5.1",
    mainboard_vendor: "Canonical Ltd.",
    mainboard_product: "LXD",
    mainboard_version: "pc-q35-5.1",
    mainboard_firmware_vendor: "EFI Development Kit II / OVMF",
    mainboard_firmware_date: "02/06/2015",
    mainboard_firmware_version: "0.0.0",
    chassis_vendor: "QEMU",
    chassis_type: "Other",
    chassis_version: "pc-q35-5.1",
  }),
  min_hwe_kernel: "",
  node_type: 0,
  numa_nodes: () => [],
  on_network: false,
  power_bmc_node_count: 3,
  power_parameters: () => ({
    password: "",
    power_address: "192.168.1.1:8000",
    instance_name: "test",
  }),
  show_os_info: false,
  special_filesystems: () => [],
  storage_layout_issues: () => [],
  supported_filesystems: () => [],
  swap_size: null,
  updated: "Fri, 23 Oct. 2020 05:24:41",
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

export const podHint = define<PodHint>({
  cores: 8,
  local_storage: 10000000000,
  local_storage_gb: "1000",
  memory: 8000,
  memory_gb: "8",
});

const podHintExtras = define<PodHintExtras>({
  cpu_speed: 1000,
  iscsi_storage: -1,
  iscsi_storage_gb: "-0.0",
  local_disks: -1,
});

export const podStoragePool = define<PodStoragePool>({
  available: 700000000000,
  id: () => `pool-id-${random()}`,
  name: () => `pool-name-${random()}`,
  path: () => `/path/to/${random()}`,
  total: 1000000000000,
  type: "lvm",
  used: 300000000000,
});

export const podNumaNode = define<PodNumaNode>({
  cores: () => ({
    allocated: [0, 2, 4, 6],
    free: [1, 3],
  }),
  interfaces: () => [],
  memory: () => ({
    general: {
      allocated: 10240,
      free: 4068,
    },
    hugepages: [],
  }),
  node_id: () => random(),
  vms: () => [],
});

export const pod = extend<Model, Pod>(model, {
  architectures,
  available: podHint,
  capabilities,
  composed_machines_count: 1,
  cpu_over_commit_ratio: 10,
  cpu_speed: 1000,
  created: "Wed, 19 Feb. 2020 11:59:19",
  default_macvlan_mode: "",
  default_storage_pool: "b85e27c9-9d53-4821-ad64-153c53767ce9",
  hints,
  host: "",
  ip_address: (i: number) => `192.168.1.${i}`,
  memory_over_commit_ratio: 8,
  name: (i: number) => `pod${i}`,
  numa_pinning: () => [podNumaNode()],
  permissions,
  pool: 1,
  power_address: "qemu+ssh://ubuntu@127.0.0.1/system",
  power_pass: "",
  owners_count: 1,
  storage_pools,
  tags,
  total: podHint,
  type: "virsh",
  updated: "Fri, 03 Jul. 2020 02:44:12",
  used: podHint,
  zone: 1,
});

export const podDetails = extend<Pod, PodDetails>(pod, {
  attached_vlans: () => [],
  boot_vlans: () => [],
});
