export const ScriptStatus = {
  PENDING: 0,
  RUNNING: 1,
  PASSED: 2,
  FAILED: 3,
  TIMEDOUT: 4,
  ABORTED: 5,
  DEGRADED: 6,
  INSTALLING: 7,
  FAILED_INSTALLING: 8,
  SKIPPED: 9,
  APPLYING_NETCONF: 10,
  FAILED_APPLYING_NETCONF: 11,
};

export const NodeTypes = {
  REGION_CONTROLLER: 3,
};

export const HardwareType = {
  NODE: 0,
  CPU: 1,
  MEMORY: 2,
  STORAGE: 3,
  NETWORK: 4,
};
