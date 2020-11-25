import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type { Machine } from "app/store/machine/types";
import type { Model, ModelRef } from "app/store/types/model";

export type TestResult = -1 | 0 | 1 | 2 | 3;

export type TestStatus = {
  status: TestResult;
  pending: number;
  running: number;
  passed: number;
  failed: number;
};

/**
 * SimpleNode represents the intersection of Devices, Machines and Controllers
 */
export type SimpleNode = Model & {
  actions: string[];
  domain: ModelRef;
  hostname: string;
  fqdn: string;
  link_type: string;
  node_type_display: string;
  permissions: string[];
  system_id: string;
  tags: string[];
};

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
  status_code: number;
  storage_test_status: TestStatus;
};

export type Node = Controller | Device | Machine;
