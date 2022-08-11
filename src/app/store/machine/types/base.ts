import type { MachineMeta } from "./enum";

import type { APIError, Seconds } from "app/base/types";
import type { CloneError } from "app/machines/components/MachineHeaderForms/ActionFormWrapper/CloneForm/CloneResults/CloneResults";
import type { CertificateMetadata, PowerType } from "app/store/general/types";
import type { PowerState, StorageLayout } from "app/store/types/enum";
import type { ModelRef, TimestampFields } from "app/store/types/model";
import type {
  BaseNode,
  Disk,
  Filesystem,
  GroupedStorage,
  NetworkInterface,
  NodeActions,
  NodeDeviceRef,
  NodeEvent,
  NodeIpAddress,
  NodeLinkType,
  NodeMetadata,
  NodeNumaNode,
  NodeTypeDisplay,
  NodeVlan,
  PowerParameters,
  SupportedFilesystem,
  TestStatus,
  WorkloadAnnotations,
} from "app/store/types/node";
import type { EventError, GenericState } from "app/store/types/state";

export type MachineActions = Exclude<NodeActions, NodeActions.IMPORT_IMAGES>;

// BaseMachine is returned from the server when using "machine.list", and is
// used in the machine list. This type is missing some properties due to an
// optimisation on the backend to reduce the amount of database queries on list
// pages.
export type BaseMachine = BaseNode & {
  actions: MachineActions[];
  error_description: string;
  extra_macs: string[];
  fabrics: string[];
  has_logs: boolean;
  ip_addresses?: NodeIpAddress[];
  link_speeds: number[];
  link_type: NodeLinkType.MACHINE;
  node_type_display: NodeTypeDisplay.MACHINE;
  numa_nodes_count: number;
  owner: string;
  physical_disk_count: number;
  pod?: ModelRef;
  pool: ModelRef;
  power_state: PowerState;
  power_type: PowerType["name"] | "";
  pxe_mac_vendor?: string;
  pxe_mac?: string;
  spaces: string[];
  sriov_support: boolean;
  storage_tags: string[];
  storage: number;
  subnets: string[];
  testing_status: TestStatus;
  vlan?: NodeVlan | null;
  workload_annotations: WorkloadAnnotations;
  zone: ModelRef;
};

// MachineDetails is returned from the server when using "machine.get", and is
// used in the machine details pages. This type contains all possible properties
// of a machine model.
export type MachineDetails = BaseMachine &
  TimestampFields &
  HardwareSyncFields & {
    bios_boot_method: string;
    bmc: number;
    boot_disk: Disk | null;
    certificate?: CertificateMetadata;
    commissioning_start_time: string;
    commissioning_status: TestStatus;
    cpu_test_status: TestStatus;
    current_commissioning_script_set: number;
    current_installation_script_set: number;
    current_testing_script_set: number;
    detected_storage_layout: StorageLayout;
    devices: NodeDeviceRef[];
    dhcp_on: boolean;
    disks: Disk[];
    error: string;
    events: NodeEvent[];
    grouped_storages: GroupedStorage[];
    hardware_uuid: string;
    hwe_kernel: string;
    installation_start_time: string;
    installation_status: number;
    interface_test_status: TestStatus;
    interfaces: NetworkInterface[];
    license_key: string;
    memory_test_status: TestStatus;
    metadata: NodeMetadata;
    min_hwe_kernel: string;
    network_test_status: TestStatus;
    node_type: number;
    numa_nodes: NodeNumaNode[];
    on_network: boolean;
    other_test_status: TestStatus;
    power_bmc_node_count: number;
    power_parameters: PowerParameters;
    show_os_info: boolean;
    special_filesystems: Filesystem[];
    storage_layout_issues: string[];
    storage_test_status: TestStatus;
    supported_filesystems: SupportedFilesystem[];
    swap_size: number | null;
    testing_start_time: string;
  };

type HardwareSyncFields =
  | {
      enable_hw_sync: false;
    }
  | {
      enable_hw_sync: true;
      last_sync: string;
      next_sync: string;
      is_sync_healthy: boolean;
      sync_interval: Seconds;
    };

// Depending on where the user has navigated in the app, machines in state can
// either be of type BaseMachine or MachineDetails.
export type Machine = BaseMachine | MachineDetails;

export type MachineStatus = {
  aborting: boolean;
  acquiring: boolean;
  applyingStorageLayout: boolean;
  checkingPower: boolean;
  cloning: boolean;
  creatingBcache: boolean;
  creatingBond: boolean;
  creatingBridge: boolean;
  creatingCacheSet: boolean;
  creatingLogicalVolume: boolean;
  creatingPartition: boolean;
  creatingPhysical: boolean;
  creatingRaid: boolean;
  creatingVlan: boolean;
  creatingVmfsDatastore: boolean;
  creatingVolumeGroup: boolean;
  commissioning: boolean;
  deleting: boolean;
  deletingCacheSet: boolean;
  deletingDisk: boolean;
  deletingFilesystem: boolean;
  deletingInterface: boolean;
  deletingPartition: boolean;
  deletingVolumeGroup: boolean;
  deploying: boolean;
  enteringRescueMode: boolean;
  exitingRescueMode: boolean;
  gettingSummaryXml: boolean;
  gettingSummaryYaml: boolean;
  linkingSubnet: boolean;
  locking: boolean;
  markingBroken: boolean;
  markingFixed: boolean;
  mountingSpecial: boolean;
  overridingFailedTesting: boolean;
  releasing: boolean;
  settingBootDisk: boolean;
  settingPool: boolean;
  settingZone: boolean;
  tagging: boolean;
  testing: boolean;
  turningOff: boolean;
  turningOn: boolean;
  unlocking: boolean;
  unlinkingSubnet: boolean;
  unmountingSpecial: boolean;
  unsubscribing: boolean;
  untagging: boolean;
  updatingDisk: boolean;
  updatingFilesystem: boolean;
  updatingInterface: boolean;
  updatingVmfsDatastore: boolean;
};

export type MachineStatuses = Record<Machine[MachineMeta.PK], MachineStatus>;

export type MachineStateDetailsItem = {
  errors: APIError;
  loaded: boolean;
  loading: boolean;
  system_id: Machine[MachineMeta.PK];
};

export type MachineStateDetails = Record<string, MachineStateDetailsItem>;

export type MachineStateListGroup = {
  collapsed: boolean;
  count: number;
  items: Machine[MachineMeta.PK][];
  name: string | null;
};

export type MachineStateList = {
  count: number | null;
  cur_page: number | null;
  errors: APIError;
  groups: MachineStateListGroup[] | null;
  loaded: boolean;
  loading: boolean;
  num_pages: number | null;
};

export type MachineStateLists = Record<string, MachineStateList>;

export type FilterGroupOptionType = boolean | number | string[] | string;

export type FilterGroupOption<K = FilterGroupOptionType> = {
  key: K;
  label: string;
};

export enum FilterGroupType {
  Bool = "bool",
  Dict = "dict[str,str]",
  Float = "float",
  FloatList = "list[float]",
  Int = "int",
  IntList = "list[int]",
  String = "str",
  StringList = "list[str]",
}

export type FilterGroup = {
  errors: APIError;
  key: string;
  label: string;
  loaded: boolean;
  loading: boolean;
  dynamic: boolean;
  for_grouping: boolean;
} & (
  | { options: FilterGroupOption<boolean>[] | null; type: FilterGroupType.Bool }
  | {
      options: FilterGroupOption<string>[] | null;
      type:
        | FilterGroupType.Dict
        | FilterGroupType.StringList
        | FilterGroupType.String;
    }
  | {
      options: FilterGroupOption<number>[] | null;
      type:
        | FilterGroupType.Float
        | FilterGroupType.Int
        | FilterGroupType.FloatList
        | FilterGroupType.IntList;
    }
);

export type MachineEventErrors = CloneError;

export type MachineStateCount = {
  count: number | null;
  errors: APIError;
  loaded: boolean;
  loading: boolean;
};

export type MachineStateCounts = Record<string, MachineStateCount>;

export type MachineState = {
  active: Machine[MachineMeta.PK] | null;
  counts: MachineStateCounts;
  details: MachineStateDetails;
  eventErrors: EventError<
    Machine,
    APIError<MachineEventErrors>,
    MachineMeta.PK
  >[];
  filters: FilterGroup[];
  filtersLoaded: boolean;
  filtersLoading: boolean;
  lists: MachineStateLists;
  selected: Machine[MachineMeta.PK][];
  statuses: MachineStatuses;
} & GenericState<Machine, APIError>;
