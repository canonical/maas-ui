export const MachineFormNames = {
  ABORT: "abort",
  ACQUIRE: "acquire",
  ADD: "add",
  ADD_CHASSIS: "add-chassis",
  CLONE: "clone",
  COMMISSION: "commission",
  DELETE: "delete",
  DEPLOY: "deploy",
  EXIT_RESCUE_MODE: "exit-rescue-mode",
  LOCK: "lock",
  MARK_BROKEN: "mark-broken",
  MARK_FIXED: "mark-fixed",
  OFF: "off",
  ON: "on",
  OVERRIDE_FAILED_TESTING: "override-failed-testing",
  RELEASE: "release",
  RESCUE_MODE: "rescue-mode",
  SET_POOL: "set-pool",
  SET_ZONE: "set-zone",
  TAG: "tag",
  TEST: "test",
  UNLOCK: "unlock",
} as const;

export const PodFormNames = {
  COMPOSE: "compose",
  DELETE: "delete",
  REFRESH: "refresh",
} as const;

export enum UIMeta {
  MODEL = "ui",
}
