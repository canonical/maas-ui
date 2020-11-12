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

type NodeStatus =
  | "New"
  | "Commissioning"
  | "Failed commissioning"
  | "Missing"
  | "Ready"
  | "Reserved"
  | "Allocated"
  | "Deploying"
  | "Deployed"
  | "Retired"
  | "Broken"
  | "Failed deployment"
  | "Releasing"
  | "Releasing failed"
  | "Disk erasing"
  | "Failed disk erasing"
  | "Rescue mode"
  | "Entering rescue mode"
  | "Failed to enter rescue mode"
  | "Exiting rescue mode"
  | "Failed to exit rescue mode"
  | "Testing"
  | "Failed testing";

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
