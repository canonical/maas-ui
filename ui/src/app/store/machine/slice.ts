import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { MachineMeta } from "./types";
import type {
  Machine,
  MachineState,
  MachineStatus,
  NetworkInterface,
  NetworkInterfaceParams,
  NetworkLink,
  NetworkLinkMode,
  StorageLayout,
  DiskTypes,
} from "./types";

import type { LicenseKeys } from "app/store/licensekeys/types";
import type { ResourcePool } from "app/store/resourcepool/types";
import type { Script } from "app/store/script/types";
import type { ScriptResult } from "app/store/scriptresult/types";
import type { Subnet } from "app/store/subnet/types";
import { NodeActions } from "app/store/types/node";
import { generateStatusHandlers, updateErrors } from "app/store/utils";
import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";
import type { StatusHandlers } from "app/store/utils/slice";
import type { Zone } from "app/store/zone/types";
import { kebabToCamelCase } from "app/utils";

export type ScriptInput = {
  [x: string]: { url: string };
};

const generateParams = <P extends { [x: string]: unknown }>(
  params: P,
  mapping: { [x: string]: string } = {}
) => {
  const payload: { [x: string]: unknown } = {};
  Object.entries(params).forEach(([key, value]) => {
    if (key in mapping) {
      // if the payload should use a different key then update it.
      key = mapping[key];
    }
    // Don't include any undefined values.
    if (typeof value !== "undefined") {
      payload[key] = value;
    }
  });
  return payload;
};

type CreateParams = {
  architecture?: Machine["architecture"];
  commission?: boolean;
  cpu_count?: Machine["cpu_count"];
  description?: Machine["description"];
  distro_series?: Machine["distro_series"];
  domain?: Machine["domain"];
  ephemeral_deploy?: boolean;
  extra_macs: Machine["extra_macs"];
  hostname?: Machine["hostname"];
  hwe_kernel?: string;
  install_rackd?: boolean;
  license_key?: LicenseKeys["license_key"];
  memory?: Machine["memory"];
  min_hwe_kernel?: string;
  osystem?: Machine["osystem"];
  pxe_mac: Machine["pxe_mac"];
  swap_size?: string;
};

type UpdateParams = CreateParams & {
  [MachineMeta.PK]: Machine[MachineMeta.PK];
  tags?: Machine["tags"];
};

type Action = {
  name: string;
  status: keyof MachineStatus;
};

export const ACTIONS: Action[] = [
  {
    name: NodeActions.ABORT,
    status: "aborting",
  },
  {
    name: NodeActions.ACQUIRE,
    status: "acquiring",
  },
  {
    name: "apply-storage-layout",
    status: "applyingStorageLayout",
  },
  {
    name: "check-power",
    status: "checkingPower",
  },
  {
    name: NodeActions.COMMISSION,
    status: "commissioning",
  },
  {
    name: "create-bcache",
    status: "creatingBcache",
  },
  {
    name: "create-bond",
    status: "creatingBond",
  },
  {
    name: "create-bridge",
    status: "creatingBridge",
  },
  {
    name: "create-cache-set",
    status: "creatingCacheSet",
  },
  {
    name: "create-logical-volume",
    status: "creatingLogicalVolume",
  },
  {
    name: "create-partition",
    status: "creatingPartition",
  },
  {
    name: "create-physical",
    status: "creatingPhysical",
  },
  {
    name: "create-raid",
    status: "creatingRaid",
  },
  {
    name: "create-vlan",
    status: "creatingVlan",
  },
  {
    name: "create-vmfs-datastore",
    status: "creatingVmfsDatastore",
  },
  {
    name: "create-volume-group",
    status: "creatingVolumeGroup",
  },
  {
    name: NodeActions.DELETE,
    status: "deleting",
  },
  {
    name: "delete-cache-set",
    status: "deletingCacheSet",
  },
  {
    name: "delete-disk",
    status: "deletingDisk",
  },
  {
    name: "delete-filesystem",
    status: "deletingFilesystem",
  },
  {
    name: "delete-interface",
    status: "deletingInterface",
  },
  {
    name: "delete-partition",
    status: "deletingPartition",
  },
  {
    name: "delete-volume-group",
    status: "deletingVolumeGroup",
  },
  {
    name: NodeActions.DEPLOY,
    status: "deploying",
  },
  {
    name: NodeActions.RESCUE_MODE,
    status: "enteringRescueMode",
  },
  {
    name: NodeActions.EXIT_RESCUE_MODE,
    status: "exitingRescueMode",
  },
  {
    name: "get-summary-xml",
    status: "gettingSummaryXml",
  },
  {
    name: "get-summary-yaml",
    status: "gettingSummaryYaml",
  },
  {
    name: "link-subnet",
    status: "linkingSubnet",
  },
  {
    name: NodeActions.LOCK,
    status: "locking",
  },
  {
    name: NodeActions.MARK_BROKEN,
    status: "markingBroken",
  },
  {
    name: NodeActions.MARK_FIXED,
    status: "markingFixed",
  },
  {
    name: "mount-special",
    status: "mountingSpecial",
  },
  {
    name: NodeActions.OVERRIDE_FAILED_TESTING,
    status: "overridingFailedTesting",
  },
  {
    name: NodeActions.RELEASE,
    status: "releasing",
  },
  {
    name: "set-boot-disk",
    status: "settingBootDisk",
  },
  {
    name: NodeActions.SET_POOL,
    status: "settingPool",
  },
  {
    name: NodeActions.SET_ZONE,
    status: "settingZone",
  },
  {
    name: NodeActions.TAG,
    status: "tagging",
  },
  {
    name: NodeActions.TEST,
    status: "testing",
  },
  {
    name: NodeActions.OFF,
    status: "turningOff",
  },
  {
    name: NodeActions.ON,
    status: "turningOn",
  },
  {
    name: NodeActions.UNLOCK,
    status: "unlocking",
  },
  {
    name: "unlink-subnet",
    status: "unlinkingSubnet",
  },
  {
    name: "unmount-special",
    status: "unmountingSpecial",
  },
  {
    name: "update-disk",
    status: "updatingDisk",
  },
  {
    name: "update-filesystem",
    status: "updatingFilesystem",
  },
  {
    name: "update-interface",
    status: "updatingInterface",
  },
  {
    name: "update-vmfs-datastore",
    status: "updatingVmfsDatastore",
  },
];

const DEFAULT_STATUSES = {
  aborting: false,
  acquiring: false,
  applyingStorageLayout: false,
  checkingPower: false,
  creatingBcache: false,
  creatingBond: false,
  creatingBridge: false,
  creatingCacheSet: false,
  creatingLogicalVolume: false,
  creatingPartition: false,
  creatingPhysical: false,
  creatingRaid: false,
  creatingVlan: false,
  creatingVmfsDatastore: false,
  creatingVolumeGroup: false,
  commissioning: false,
  deleting: false,
  deletingCacheSet: false,
  deletingDisk: false,
  deletingFilesystem: false,
  deletingInterface: false,
  deletingPartition: false,
  deletingVolumeGroup: false,
  deploying: false,
  enteringRescueMode: false,
  exitingRescueMode: false,
  gettingSummaryXml: false,
  gettingSummaryYaml: false,
  linkingSubnet: false,
  locking: false,
  markingBroken: false,
  markingFixed: false,
  mountingSpecial: false,
  overridingFailedTesting: false,
  releasing: false,
  settingBootDisk: false,
  settingPool: false,
  settingZone: false,
  tagging: false,
  testing: false,
  turningOff: false,
  turningOn: false,
  unlocking: false,
  unlinkingSubnet: false,
  unmountingSpecial: false,
  updatingDisk: false,
  updatingFilesystem: false,
  updatingInterface: false,
  updatingVmfsDatastore: false,
};

// Common params for methods that can accept a link.
type LinkParams = {
  default_gateway?: boolean;
  ip_address?: NetworkLink["ip_address"];
  mode?: NetworkLinkMode;
  subnet?: Subnet["id"];
};

/**
 * Wrap the updateError call so that the call is made with the correct generics.
 */
const setErrors = (
  state: MachineState,
  action: PayloadAction<MachineState["errors"]> | null,
  event: string | null
): MachineState =>
  updateErrors<MachineState, MachineMeta.PK>(
    state,
    action,
    event,
    MachineMeta.PK
  );

const statusHandlers = generateStatusHandlers<
  MachineState,
  Machine,
  MachineMeta.PK
>(
  MachineMeta.PK,
  ACTIONS.map((action) => {
    const handler: StatusHandlers<MachineState, Machine> = {
      status: kebabToCamelCase(action.name),
      method: "action",
      statusKey: action.status,
    };
    return handler;
  }),
  setErrors
);

const machineSlice = createSlice({
  name: MachineMeta.MODEL,
  initialState: {
    ...genericInitialState,
    active: null,
    eventErrors: [],
    selected: [],
    statuses: {},
  } as MachineState,
  reducers: {
    ...generateCommonReducers<
      MachineState,
      MachineMeta.PK,
      CreateParams,
      UpdateParams
    >(MachineMeta.MODEL, MachineMeta.PK, setErrors),
    [NodeActions.ABORT]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ABORT,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.ABORT}Error`]: statusHandlers.abort.error,
    [`${NodeActions.ABORT}Start`]: statusHandlers.abort.start,
    [`${NodeActions.ABORT}Success`]: statusHandlers.abort.success,
    [NodeActions.ACQUIRE]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ACQUIRE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.ACQUIRE}Error`]: statusHandlers.acquire.error,
    [`${NodeActions.ACQUIRE}Start`]: statusHandlers.acquire.start,
    [`${NodeActions.ACQUIRE}Success`]: statusHandlers.acquire.success,
    addChassis: {
      prepare: (params: { [x: string]: string }) => ({
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    addChassisError: (
      state: MachineState,
      action: PayloadAction<MachineState["errors"]>
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "addChassis");
      state.loading = false;
      state.saving = false;
    },
    addChassisStart: (state: MachineState) => {
      state.saved = false;
      state.saving = true;
    },
    addChassisSuccess: (state: MachineState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    applyStorageLayout: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        storageLayout: StorageLayout;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "apply_storage_layout",
        },
        payload: {
          params: {
            storage_layout: params.storageLayout,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    applyStorageLayoutError: statusHandlers.applyStorageLayout.error,
    applyStorageLayoutStart: statusHandlers.applyStorageLayout.start,
    applyStorageLayoutSuccess: statusHandlers.applyStorageLayout.success,
    checkPower: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "check_power",
        },
        payload: {
          params: {
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    checkPowerError: statusHandlers.checkPower.error,
    checkPowerStart: statusHandlers.checkPower.start,
    checkPowerSuccess: statusHandlers.checkPower.success,
    [NodeActions.COMMISSION]: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        enableSSH: boolean;
        skipBMCConfig: boolean;
        skipNetworking: boolean;
        skipStorage: boolean;
        updateFirmware: boolean;
        configureHBA: boolean;
        commissioningScripts: Script[];
        testingScripts: Script[];
        scriptInputs: ScriptInput[];
      }) => {
        let formattedCommissioningScripts: (string | Script["id"])[] = [];
        if (
          params.commissioningScripts &&
          params.commissioningScripts.length > 0
        ) {
          formattedCommissioningScripts = params.commissioningScripts.map(
            (script) => script.id
          );
          if (params.updateFirmware) {
            formattedCommissioningScripts.push("update_firmware");
          }
          if (params.configureHBA) {
            formattedCommissioningScripts.push("configure_hba");
          }
        }
        return {
          meta: {
            model: MachineMeta.MODEL,
            method: "action",
          },
          payload: {
            params: {
              action: NodeActions.COMMISSION,
              system_id: params.systemId,
              extra: {
                enable_ssh: params.enableSSH,
                skip_bmc_config: params.skipBMCConfig,
                skip_networking: params.skipNetworking,
                skip_storage: params.skipStorage,
                commissioning_scripts: formattedCommissioningScripts,
                testing_scripts:
                  params.testingScripts &&
                  params.testingScripts.map((script) => script.id),
                script_input: params.scriptInputs,
              },
            },
          },
        };
      },
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.COMMISSION}Error`]: statusHandlers.commission.error,
    [`${NodeActions.COMMISSION}Start`]: statusHandlers.commission.start,
    [`${NodeActions.COMMISSION}Success`]: statusHandlers.commission.success,
    createBcache: {
      prepare: (params: {
        blockId?: number;
        cacheMode: string;
        cacheSetId: number;
        fstype?: string;
        mountOptions?: string;
        mountPoint?: string;
        name: string;
        partitionId?: number;
        systemId: Machine[MachineMeta.PK];
        tags?: string[];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_bcache",
        },
        payload: {
          params: generateParams(params, {
            cacheMode: "cache_mode",
            cacheSetId: "cache_set",
            systemId: MachineMeta.PK,
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionId: "partition_id",
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createBcacheError: statusHandlers.createBcache.error,
    createBcacheStart: statusHandlers.createBcache.start,
    createBcacheSuccess: statusHandlers.createBcache.success,
    createBond: {
      prepare: (
        params: {
          bond_downdelay?: NetworkInterfaceParams["bond_downdelay"];
          bond_lacp_rate?: NetworkInterfaceParams["bond_lacp_rate"];
          bond_miimon?: NetworkInterfaceParams["bond_miimon"];
          bond_mode?: NetworkInterfaceParams["bond_mode"];
          bond_num_grat_arp?: NetworkInterfaceParams["bond_num_grat_arp"];
          bond_updelay?: NetworkInterfaceParams["bond_updelay"];
          bond_xmit_hash_policy?: NetworkInterfaceParams["bond_xmit_hash_policy"];
          interface_speed?: NetworkInterface["interface_speed"];
          link_connected?: NetworkInterface["link_connected"];
          link_speed?: NetworkInterface["link_speed"];
          mac_address?: NetworkInterface["mac_address"];
          name?: NetworkInterface["name"];
          parents: NetworkInterface["parents"];
          system_id: Machine[MachineMeta.PK];
          tags?: NetworkInterface["tags"];
          vlan?: NetworkInterface["vlan_id"];
        } & LinkParams
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_bond",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createBondError: statusHandlers.createBond.error,
    createBondStart: statusHandlers.createBond.start,
    createBondSuccess: statusHandlers.createBond.success,
    createBridge: {
      prepare: (
        params: {
          bridge_fd?: NetworkInterfaceParams["bridge_fd"];
          bridge_stp?: NetworkInterfaceParams["bridge_stp"];
          bridge_type?: NetworkInterfaceParams["bridge_type"];
          interface_speed?: NetworkInterface["interface_speed"];
          link_connected?: NetworkInterface["link_connected"];
          link_speed?: NetworkInterface["link_speed"];
          mac_address?: NetworkInterface["mac_address"];
          name?: NetworkInterface["name"];
          parents: NetworkInterface["parents"];
          system_id: Machine[MachineMeta.PK];
          tags?: NetworkInterface["tags"];
          vlan?: NetworkInterface["vlan_id"];
        } & LinkParams
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_bridge",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createBridgeError: statusHandlers.createBridge.error,
    createBridgeStart: statusHandlers.createBridge.start,
    createBridgeSuccess: statusHandlers.createBridge.success,
    createCacheSet: {
      prepare: (params: {
        blockId?: number;
        partitionId?: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_cache_set",
        },
        payload: {
          params: generateParams(params, {
            blockId: "block_id",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createCacheSetError: statusHandlers.createCacheSet.error,
    createCacheSetStart: statusHandlers.createCacheSet.start,
    createCacheSetSuccess: statusHandlers.createCacheSet.success,
    createLogicalVolume: {
      prepare: (params: {
        fstype?: string;
        mountOptions?: string;
        mountPoint?: string;
        name: string;
        size: number;
        systemId: Machine[MachineMeta.PK];
        tags?: string[];
        volumeGroupId: number;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_logical_volume",
        },
        payload: {
          params: generateParams(params, {
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            systemId: MachineMeta.PK,
            volumeGroupId: "volume_group_id",
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createLogicalVolumeError: statusHandlers.createLogicalVolume.error,
    createLogicalVolumeStart: statusHandlers.createLogicalVolume.start,
    createLogicalVolumeSuccess: statusHandlers.createLogicalVolume.success,
    createNotify: (state: MachineState, action) => {
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Machine) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.system_id] = DEFAULT_STATUSES;
      }
    },
    createPartition: {
      prepare: (params: {
        blockId: number;
        fstype?: string;
        mountOptions?: string;
        mountPoint?: string;
        partitionSize: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_partition",
        },
        payload: {
          params: {
            block_id: params.blockId,
            fstype: params.fstype,
            mount_options: params.mountOptions,
            mount_point: params.mountPoint,
            partition_size: params.partitionSize,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createPartitionError: statusHandlers.createPartition.error,
    createPartitionStart: statusHandlers.createPartition.start,
    createPartitionSuccess: statusHandlers.createPartition.success,
    createPhysical: {
      prepare: (
        params: {
          enabled?: NetworkInterface["enabled"];
          interface_speed?: NetworkInterface["interface_speed"];
          ip_assignment?: "external" | "dynamic" | "static";
          link_connected?: NetworkInterface["link_connected"];
          link_speed?: NetworkInterface["link_speed"];
          mac_address: NetworkInterface["mac_address"];
          name?: NetworkInterface["name"];
          numa_node?: NetworkInterface["numa_node"];
          system_id: Machine[MachineMeta.PK];
          tags?: NetworkInterface["tags"];
          vlan?: NetworkInterface["vlan_id"];
        } & LinkParams
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_physical",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createPhysicalError: statusHandlers.createPhysical.error,
    createPhysicalStart: statusHandlers.createPhysical.start,
    createPhysicalSuccess: statusHandlers.createPhysical.success,
    createRaid: {
      prepare: (params: {
        blockDeviceIds?: number[];
        fstype?: string;
        level: DiskTypes;
        mountOptions?: string;
        mountPoint?: string;
        name: string;
        partitionIds?: number[];
        spareBlockDeviceIds?: number[];
        sparePartitionIds?: number[];
        systemId: Machine[MachineMeta.PK];
        tags?: string[];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_raid",
        },
        payload: {
          params: generateParams(params, {
            blockDeviceIds: "block_devices",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionIds: "partitions",
            spareBlockDeviceIds: "spare_devices",
            sparePartitionIds: "spare_partitions",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createRaidError: statusHandlers.createRaid.error,
    createRaidStart: statusHandlers.createRaid.start,
    createRaidSuccess: statusHandlers.createRaid.success,
    createVlan: {
      prepare: (
        params: {
          interface_speed?: NetworkInterface["interface_speed"];
          link_connected?: NetworkInterface["link_connected"];
          link_speed?: NetworkInterface["link_speed"];
          parent: NetworkInterface["parents"][0];
          system_id: Machine[MachineMeta.PK];
          tags?: NetworkInterface["tags"];
          vlan?: NetworkInterface["vlan_id"];
        } & LinkParams
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_vlan",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createVlanError: statusHandlers.createVlan.error,
    createVlanStart: statusHandlers.createVlan.start,
    createVlanSuccess: statusHandlers.createVlan.success,
    createVmfsDatastore: {
      prepare: (params: {
        blockDeviceIds?: number[];
        name: string;
        partitionIds?: number[];
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_vmfs_datastore",
        },
        payload: {
          params: generateParams(params, {
            blockDeviceIds: "block_devices",
            partitionIds: "partitions",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createVmfsDatastoreError: statusHandlers.createVmfsDatastore.error,
    createVmfsDatastoreStart: statusHandlers.createVmfsDatastore.start,
    createVmfsDatastoreSuccess: statusHandlers.createVmfsDatastore.success,
    createVolumeGroup: {
      prepare: (params: {
        blockDeviceIds?: number[];
        name: string;
        partitionIds?: number[];
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "create_volume_group",
        },
        payload: {
          params: generateParams(params, {
            blockDeviceIds: "block_devices",
            partitionIds: "partitions",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    createVolumeGroupError: statusHandlers.createVolumeGroup.error,
    createVolumeGroupStart: statusHandlers.createVolumeGroup.start,
    createVolumeGroupSuccess: statusHandlers.createVolumeGroup.success,
    [NodeActions.DELETE]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DELETE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.DELETE}Error`]: statusHandlers.delete.error,
    [`${NodeActions.DELETE}Start`]: statusHandlers.delete.start,
    [`${NodeActions.DELETE}Success`]: statusHandlers.delete.success,
    [`${NodeActions.DELETE}Notify`]: (state: MachineState, action) => {
      const index = state.items.findIndex(
        (item: Machine) => item.system_id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (machineId: Machine[MachineMeta.PK]) => machineId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    deleteCacheSet: {
      prepare: (params: {
        cacheSetId: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_cache_set",
        },
        payload: {
          params: {
            cache_set_id: params.cacheSetId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteCacheSetError: statusHandlers.deleteCacheSet.error,
    deleteCacheSetStart: statusHandlers.deleteCacheSet.start,
    deleteCacheSetSuccess: statusHandlers.deleteCacheSet.success,
    deleteDisk: {
      prepare: (params: {
        blockId: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_disk",
        },
        payload: {
          params: {
            block_id: params.blockId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteDiskError: statusHandlers.deleteDisk.error,
    deleteDiskStart: statusHandlers.deleteDisk.start,
    deleteDiskSuccess: statusHandlers.deleteDisk.success,
    deleteFilesystem: {
      prepare: (params: {
        blockDeviceId?: number;
        filesystemId: number;
        partitionId?: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_filesystem",
        },
        payload: {
          params: generateParams(params, {
            blockDeviceId: "blockdevice_id",
            filesystemId: "filesystem_id",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteFilesystemError: statusHandlers.deleteFilesystem.error,
    deleteFilesystemStart: statusHandlers.deleteFilesystem.start,
    deleteFilesystemSuccess: statusHandlers.deleteFilesystem.success,
    deleteInterface: {
      prepare: (params: {
        interfaceId: NetworkInterface["id"];
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_interface",
        },
        payload: {
          params: {
            interface_id: params.interfaceId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteInterfaceError: statusHandlers.deleteInterface.error,
    deleteInterfaceStart: statusHandlers.deleteInterface.start,
    deleteInterfaceSuccess: statusHandlers.deleteInterface.success,
    deletePartition: {
      prepare: (params: {
        partitionId: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_partition",
        },
        payload: {
          params: {
            partition_id: params.partitionId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deletePartitionError: statusHandlers.deletePartition.error,
    deletePartitionStart: statusHandlers.deletePartition.start,
    deletePartitionSuccess: statusHandlers.deletePartition.success,
    deleteVolumeGroup: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        volumeGroupId: number;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "delete_volume_group",
        },
        payload: {
          params: {
            system_id: params.systemId,
            volume_group_id: params.volumeGroupId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    deleteVolumeGroupError: statusHandlers.deleteVolumeGroup.error,
    deleteVolumeGroupStart: statusHandlers.deleteVolumeGroup.start,
    deleteVolumeGroupSuccess: statusHandlers.deleteVolumeGroup.success,
    [NodeActions.DEPLOY]: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        extra?: {
          osystem: Machine["osystem"];
          distro_series: Machine["distro_series"];
          hwe_kernel: string;
          register_vmhost?: boolean;
          install_kvm?: boolean;
          user_data?: string;
        };
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.DEPLOY,
            extra: params.extra || {},
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.DEPLOY}Error`]: statusHandlers.deploy.error,
    [`${NodeActions.DEPLOY}Start`]: statusHandlers.deploy.start,
    [`${NodeActions.DEPLOY}Success`]: statusHandlers.deploy.success,
    exitRescueMode: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.EXIT_RESCUE_MODE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    exitRescueModeError: statusHandlers.exitRescueMode.error,
    exitRescueModeStart: statusHandlers.exitRescueMode.start,
    exitRescueModeSuccess: statusHandlers.exitRescueMode.success,
    fetch: {
      prepare: () => ({
        meta: {
          batch: true,
          model: MachineMeta.MODEL,
          method: "list",
          subsequentLimit: 100,
        },
        payload: {
          params: { limit: 25 },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    fetchComplete: (state: MachineState) => {
      state.loading = false;
      state.loaded = true;
    },
    fetchSuccess: (state: MachineState, action: PayloadAction<Machine[]>) => {
      action.payload.forEach((newItem: Machine) => {
        // Add items that don't already exist in the store. Existing items
        // are probably MachineDetails so this would overwrite them with the
        // simple machine. Existing items will be kept up to date via the
        // notify (sync) messages.
        const existing = state.items.find(
          (draftItem: Machine) => draftItem.id === newItem.id
        );
        if (!existing) {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
    },
    get: {
      prepare: (machineID: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "get",
        },
        payload: {
          params: { system_id: machineID },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getError: (
      state: MachineState,
      action: PayloadAction<MachineState["errors"]>
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "get");
      state.loading = false;
      state.saving = false;
    },
    getStart: (state: MachineState) => {
      state.loading = true;
    },
    getSuccess: (state: MachineState, action: PayloadAction<Machine>) => {
      const machine = action.payload;
      // If the item already exists, update it, otherwise
      // add it to the store.
      const i = state.items.findIndex(
        (draftItem: Machine) => draftItem.system_id === machine.system_id
      );
      if (i !== -1) {
        state.items[i] = machine;
      } else {
        state.items.push(machine);
        // Set up the statuses for this machine.
        state.statuses[machine.system_id] = DEFAULT_STATUSES;
      }
      state.loading = false;
    },
    getSummaryXml: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        fileId: string;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "get_summary_xml",
          // This request needs to store the results in the file context.
          fileContextKey: params.fileId,
          useFileContext: true,
        },
        payload: {
          params: {
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getSummaryXmlError: statusHandlers.getSummaryXml.error,
    getSummaryXmlStart: statusHandlers.getSummaryXml.start,
    getSummaryXmlSuccess: statusHandlers.getSummaryXml.success,
    getSummaryYaml: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        fileId: string;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "get_summary_yaml",
          // This request needs to store the results in the file context.
          fileContextKey: params.fileId,
          useFileContext: true,
        },
        payload: {
          params: {
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    getSummaryYamlError: statusHandlers.getSummaryYaml.error,
    getSummaryYamlStart: statusHandlers.getSummaryYaml.start,
    getSummaryYamlSuccess: statusHandlers.getSummaryYaml.success,
    linkSubnet: {
      prepare: (params: {
        interface_id: NetworkInterface["id"];
        ip_address?: NetworkLink["ip_address"];
        link_id?: NetworkLink["id"];
        mode: NetworkLinkMode;
        subnet?: Subnet["id"];
        system_id: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "link_subnet",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    linkSubnetError: statusHandlers.linkSubnet.error,
    linkSubnetStart: statusHandlers.linkSubnet.start,
    linkSubnetSuccess: statusHandlers.linkSubnet.success,
    [NodeActions.LOCK]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.LOCK,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.LOCK}Error`]: statusHandlers.lock.error,
    [`${NodeActions.LOCK}Start`]: statusHandlers.lock.start,
    [`${NodeActions.LOCK}Success`]: statusHandlers.lock.success,
    markBroken: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        message: string;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_BROKEN,
            extra: { message: params.message },
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    markBrokenError: statusHandlers.markBroken.error,
    markBrokenStart: statusHandlers.markBroken.start,
    markBrokenSuccess: statusHandlers.markBroken.success,
    markFixed: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.MARK_FIXED,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    markFixedError: statusHandlers.markFixed.error,
    markFixedStart: statusHandlers.markFixed.start,
    markFixedSuccess: statusHandlers.markFixed.success,
    mountSpecial: {
      prepare: (params: {
        fstype: string;
        mountOptions: string;
        mountPoint: string;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "mount_special",
        },
        payload: {
          params: {
            fstype: params.fstype,
            mount_options: params.mountOptions,
            mount_point: params.mountPoint,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    mountSpecialError: statusHandlers.mountSpecial.error,
    mountSpecialStart: statusHandlers.mountSpecial.start,
    mountSpecialSuccess: statusHandlers.mountSpecial.success,
    [NodeActions.OFF]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OFF,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.OFF}Error`]: statusHandlers.off.error,
    [`${NodeActions.OFF}Start`]: statusHandlers.off.start,
    [`${NodeActions.OFF}Success`]: statusHandlers.off.success,
    [NodeActions.ON]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.ON,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.ON}Error`]: statusHandlers.on.error,
    [`${NodeActions.ON}Start`]: statusHandlers.on.start,
    [`${NodeActions.ON}Success`]: statusHandlers.on.success,
    overrideFailedTesting: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.OVERRIDE_FAILED_TESTING,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    overrideFailedTestingError: statusHandlers.overrideFailedTesting.error,
    overrideFailedTestingStart: statusHandlers.overrideFailedTesting.start,
    overrideFailedTestingSuccess: statusHandlers.overrideFailedTesting.success,
    [NodeActions.RELEASE]: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        extra: {
          erase?: boolean;
          quick_erase?: boolean;
          secure_erase?: boolean;
        };
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RELEASE,
            extra: params.extra,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.RELEASE}Error`]: statusHandlers.release.error,
    [`${NodeActions.RELEASE}Start`]: statusHandlers.release.start,
    [`${NodeActions.RELEASE}Success`]: statusHandlers.release.success,
    rescueMode: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RESCUE_MODE,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    rescueModeError: statusHandlers.rescueMode.error,
    rescueModeStart: statusHandlers.rescueMode.start,
    rescueModeSuccess: statusHandlers.rescueMode.success,
    setActive: {
      prepare: (system_id: Machine[MachineMeta.PK] | null) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "set_active",
        },
        payload: {
          // Server unsets active item if primary key (system_id) is not sent.
          params: system_id ? { system_id } : null,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setActiveError: (
      state: MachineState,
      action: PayloadAction<MachineState["errors"][0]>
    ) => {
      state.active = null;
      state.errors = action.payload;
      state = setErrors(state, action, "setActive");
    },
    setActiveSuccess: (
      state: MachineState,
      action: PayloadAction<Machine | null>
    ) => {
      state.active = action.payload?.system_id || null;
    },
    setBootDisk: {
      prepare: (params: {
        blockId: number;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "set_boot_disk",
        },
        payload: {
          params: {
            block_id: params.blockId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setBootDiskError: statusHandlers.setBootDisk.error,
    setBootDiskStart: statusHandlers.setBootDisk.start,
    setBootDiskSuccess: statusHandlers.setBootDisk.success,
    setPool: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        poolId: ResourcePool["id"];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_POOL,
            extra: { pool_id: params.poolId },
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setPoolError: statusHandlers.setPool.error,
    setPoolStart: statusHandlers.setPool.start,
    setPoolSuccess: statusHandlers.setPool.success,
    setSelected: {
      prepare: (machineIDs: Machine[MachineMeta.PK][]) => ({
        payload: machineIDs,
      }),
      reducer: (
        state: MachineState,
        action: PayloadAction<Machine[MachineMeta.PK][]>
      ) => {
        state.selected = action.payload;
      },
    },
    setZone: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        zoneId: Zone["id"];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_ZONE,
            extra: { zone_id: params.zoneId },
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    setZoneError: statusHandlers.setZone.error,
    setZoneStart: statusHandlers.setZone.start,
    setZoneSuccess: statusHandlers.setZone.success,
    suppressScriptResults: {
      prepare: (
        machineID: Machine[MachineMeta.PK],
        scripts: ScriptResult[]
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "set_script_result_suppressed",
        },
        payload: {
          params: {
            system_id: machineID,
            script_result_ids: scripts.map((script) => script.id),
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [NodeActions.TAG]: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        tags: string[];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TAG,
            extra: { tags: params.tags },
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.TAG}Error`]: statusHandlers.tag.error,
    [`${NodeActions.TAG}Start`]: statusHandlers.tag.start,
    [`${NodeActions.TAG}Success`]: statusHandlers.tag.success,
    [NodeActions.TEST]: {
      prepare: (params: {
        systemId: Machine[MachineMeta.PK];
        scripts?: Script[];
        enableSSH: boolean;
        scriptInputs: ScriptInput;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.TEST,
            extra: {
              enable_ssh: params.enableSSH,
              script_input: params.scriptInputs,
              testing_scripts:
                params.scripts && params.scripts.map((script) => script.id),
            },
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.TEST}Error`]: statusHandlers.test.error,
    [`${NodeActions.TEST}Start`]: statusHandlers.test.start,
    [`${NodeActions.TEST}Success`]: statusHandlers.test.success,
    [NodeActions.UNLOCK]: {
      prepare: (system_id: Machine[MachineMeta.PK]) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.UNLOCK,
            extra: {},
            system_id,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    [`${NodeActions.UNLOCK}Error`]: statusHandlers.unlock.error,
    [`${NodeActions.UNLOCK}Start`]: statusHandlers.unlock.start,
    [`${NodeActions.UNLOCK}Success`]: statusHandlers.unlock.success,
    unlinkSubnet: {
      prepare: (params: {
        interfaceId: NetworkInterface["id"];
        linkId: NetworkLink["id"];
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "unlink_subnet",
        },
        payload: {
          params: {
            interface_id: params.interfaceId,
            link_id: params.linkId,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    unlinkSubnetError: statusHandlers.unlinkSubnet.error,
    unlinkSubnetStart: statusHandlers.unlinkSubnet.start,
    unlinkSubnetSuccess: statusHandlers.unlinkSubnet.success,
    unmountSpecial: {
      prepare: (params: {
        mountPoint: string;
        systemId: Machine[MachineMeta.PK];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "unmount_special",
        },
        payload: {
          params: {
            mount_point: params.mountPoint,
            system_id: params.systemId,
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    unmountSpecialError: statusHandlers.unmountSpecial.error,
    unmountSpecialStart: statusHandlers.unmountSpecial.start,
    unmountSpecialSuccess: statusHandlers.unmountSpecial.success,
    unsuppressScriptResults: {
      prepare: (
        machineID: Machine[MachineMeta.PK],
        scripts: ScriptResult[]
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "set_script_result_unsuppressed",
        },
        payload: {
          params: {
            system_id: machineID,
            script_result_ids: scripts.map((script) => script.id),
          },
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateDisk: {
      prepare: (params: {
        blockId: number;
        fstype?: string;
        mountOptions?: string;
        mountPoint?: string;
        name?: string;
        systemId: Machine[MachineMeta.PK];
        tags?: string[];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "update_disk",
        },
        payload: {
          params: generateParams(params, {
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateDiskError: statusHandlers.updateDisk.error,
    updateDiskStart: statusHandlers.updateDisk.start,
    updateDiskSuccess: statusHandlers.updateDisk.success,
    updateFilesystem: {
      prepare: (params: {
        blockId?: number;
        fstype?: string;
        mountOptions?: string;
        mountPoint?: string;
        partitionId?: number;
        systemId: Machine[MachineMeta.PK];
        tags?: string[];
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "update_filesystem",
        },
        payload: {
          params: generateParams(params, {
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateFilesystemError: statusHandlers.updateFilesystem.error,
    updateFilesystemStart: statusHandlers.updateFilesystem.start,
    updateFilesystemSuccess: statusHandlers.updateFilesystem.success,
    updateInterface: {
      prepare: (
        // This update endpoint is used for updating all interface types so
        // must allow all possible parameters.
        params: {
          bridge_fd?: NetworkInterfaceParams["bridge_fd"];
          bridge_stp?: NetworkInterfaceParams["bridge_stp"];
          bond_downdelay?: NetworkInterfaceParams["bond_downdelay"];
          bond_lacp_rate?: NetworkInterfaceParams["bond_lacp_rate"];
          bond_miimon?: NetworkInterfaceParams["bond_miimon"];
          bond_mode?: NetworkInterfaceParams["bond_mode"];
          bond_num_grat_arp?: NetworkInterfaceParams["bond_num_grat_arp"];
          bond_updelay?: NetworkInterfaceParams["bond_updelay"];
          bond_xmit_hash_policy?: NetworkInterfaceParams["bond_xmit_hash_policy"];
          bridge_type?: NetworkInterfaceParams["bridge_type"];
          enabled?: NetworkInterface["enabled"];
          interface_id: NetworkInterface["id"];
          interface_speed?: NetworkInterface["interface_speed"];
          link_connected?: NetworkInterface["link_connected"];
          link_id?: NetworkLink["id"];
          link_speed?: NetworkInterface["link_speed"];
          mac_address?: NetworkInterface["mac_address"];
          name?: NetworkInterface["name"];
          numa_node?: NetworkInterface["numa_node"];
          parents?: NetworkInterface["parents"];
          system_id: Machine[MachineMeta.PK];
          tags?: NetworkInterface["tags"];
          vlan?: NetworkInterface["vlan_id"];
        } & LinkParams
      ) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "update_interface",
        },
        payload: {
          params: generateParams(params),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateInterfaceError: statusHandlers.updateInterface.error,
    updateInterfaceStart: statusHandlers.updateInterface.start,
    updateInterfaceSuccess: statusHandlers.updateInterface.success,
    updateVmfsDatastore: {
      prepare: (params: {
        blockDeviceIds?: number[];
        name?: string;
        partitionIds?: number[];
        systemId: Machine[MachineMeta.PK];
        vmfsDatastoreId?: number;
      }) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "update_vmfs_datastore",
        },
        payload: {
          params: generateParams(params, {
            blockDeviceIds: "add_block_devices",
            partitionIds: "add_partitions",
            systemId: MachineMeta.PK,
            vmfsDatastoreId: "vmfs_datastore_id",
          }),
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateVmfsDatastoreError: statusHandlers.updateVmfsDatastore.error,
    updateVmfsDatastoreStart: statusHandlers.updateVmfsDatastore.start,
    updateVmfsDatastoreSuccess: statusHandlers.updateVmfsDatastore.success,
  },
});

export const { actions } = machineSlice;

export default machineSlice.reducer;
