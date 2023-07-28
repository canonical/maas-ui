import { FetchGroupKey } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

export const MachineActionSidePanelViews = {
  ABORT_MACHINE: ["machineActionForm", NodeActions.ABORT],
  ACQUIRE_MACHINE: ["machineActionForm", NodeActions.ACQUIRE],
  CLONE_MACHINE: ["machineActionForm", NodeActions.CLONE],
  COMMISSION_MACHINE: ["machineActionForm", NodeActions.COMMISSION],
  DELETE_MACHINE: ["machineActionForm", NodeActions.DELETE],
  DEPLOY_MACHINE: ["machineActionForm", NodeActions.DEPLOY],
  ENTER_RESCUE_MODE_MACHINE: ["machineActionForm", NodeActions.RESCUE_MODE],
  EXIT_RESCUE_MODE_MACHINE: ["machineActionForm", NodeActions.EXIT_RESCUE_MODE],
  LOCK_MACHINE: ["machineActionForm", NodeActions.LOCK],
  MARK_BROKEN_MACHINE: ["machineActionForm", NodeActions.MARK_BROKEN],
  MARK_FIXED_MACHINE: ["machineActionForm", NodeActions.MARK_FIXED],
  POWER_OFF_MACHINE: ["machineActionForm", NodeActions.OFF],
  POWER_ON_MACHINE: ["machineActionForm", NodeActions.ON],
  OVERRIDE_FAILED_TESTING_MACHINE: [
    "machineActionForm",
    NodeActions.OVERRIDE_FAILED_TESTING,
  ],
  RELEASE_MACHINE: ["machineActionForm", NodeActions.RELEASE],
  SET_POOL_MACHINE: ["machineActionForm", NodeActions.SET_POOL],
  SET_ZONE_MACHINE: ["machineActionForm", NodeActions.SET_ZONE],
  TAG_MACHINE: ["machineActionForm", NodeActions.TAG],
  TEST_MACHINE: ["machineActionForm", NodeActions.TEST],
  UNLOCK_MACHINE: ["machineActionForm", NodeActions.UNLOCK],
} as const;

export const MachineNonActionSidePanelViews = {
  ADD_CHASSIS: ["machineNonActionForm", "addChassis"],
  ADD_MACHINE: ["machineNonActionForm", "addMachine"],
} as const;

export const MachineSidePanelViews = {
  ...MachineActionSidePanelViews,
  ...MachineNonActionSidePanelViews,
} as const;

export const columns = [
  "fqdn",
  "power",
  "status",
  "owner",
  "pool",
  "zone",
  "fabric",
  "cpu",
  "memory",
  "disks",
  "storage",
] as const;
export type MachineColumn = (typeof columns)[number];
export type MachineColumnToggle = Exclude<MachineColumn, "fqdn">;
function isMachineColumnToggle(
  column: MachineColumn
): column is MachineColumnToggle {
  return column !== "fqdn";
}
export const columnToggles = columns.filter(isMachineColumnToggle);

export enum MachineColumns {
  FQDN = "fqdn",
  POWER = "power",
  STATUS = "status",
  OWNER = "owner",
  POOL = "pool",
  ZONE = "zone",
  FABRIC = "fabric",
  CPU = "cpu",
  MEMORY = "memory",
  DISKS = "disks",
  STORAGE = "storage",
}

export const columnLabels: Record<MachineColumns, string> = {
  fqdn: "FQDN",
  power: "Power",
  status: "Status",
  owner: "Owner",
  pool: "Pool",
  zone: "Zone",
  fabric: "Fabric",
  cpu: "Cores",
  memory: "RAM",
  disks: "Disks",
  storage: "Storage",
};

export const groupOptions: Array<{ value: FetchGroupKey | ""; label: string }> =
  [
    {
      value: "",
      label: "No grouping",
    },
    {
      value: FetchGroupKey.Status,
      label: "Group by status",
    },
    {
      value: FetchGroupKey.Owner,
      label: "Group by owner",
    },
    {
      value: FetchGroupKey.Pool,
      label: "Group by resource pool",
    },
    {
      value: FetchGroupKey.Architecture,
      label: "Group by architecture",
    },
    {
      value: FetchGroupKey.Domain,
      label: "Group by domain",
    },
    {
      value: FetchGroupKey.Parent,
      label: "Group by parent",
    },
    {
      value: FetchGroupKey.Pod,
      label: "Group by KVM",
    },
    {
      value: FetchGroupKey.PodType,
      label: "Group by KVM type",
    },
    {
      value: FetchGroupKey.PowerState,
      label: "Group by power state",
    },
    {
      value: FetchGroupKey.Zone,
      label: "Group by zone",
    },
  ];
