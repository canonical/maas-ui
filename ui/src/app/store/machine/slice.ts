import type {
  CaseReducer,
  PayloadAction,
  PrepareAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

import type { Machine, MachineState } from "./types";

import type { ScriptResult } from "app/store/scriptresults/types";
import type { Scripts } from "app/store/scripts/types";
import { NodeActions } from "app/store/types/node";
import {
  generateSlice,
  generateStatusHandlers,
  updateErrors,
} from "app/store/utils";
import type { GenericSlice } from "app/store/utils";
import type { GenericItemMeta, StatusHandlers } from "app/store/utils/slice";
import { kebabToCamelCase } from "app/utils";

export type ScriptInput = {
  [x: string]: { url: string };
};

export const ACTIONS = [
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
    name: "create-raid",
    status: "creatingRaid",
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
    name: "update-vmfs-datastore",
    status: "updatingVMFSDatastore",
  },
];

const DEFAULT_STATUSES = {
  aborting: false,
  acquiring: false,
  applyingStorageLayout: false,
  checkingPower: false,
  creatingBcache: false,
  creatingCacheSet: false,
  creatingLogicalVolume: false,
  creatingPartition: false,
  creatingRaid: false,
  creatingVmfsDatastore: false,
  creatingVolumeGroup: false,
  commissioning: false,
  deleting: false,
  deletingCacheSet: false,
  deletingDisk: false,
  deletingFilesystem: false,
  deletingPartition: false,
  deletingVolumeGroup: false,
  deploying: false,
  enteringRescueMode: false,
  exitingRescueMode: false,
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
  unmountingSpecial: false,
  updatingDisk: false,
  updatingFilesystem: false,
  updatingVmfsDatastore: false,
};

type WithPrepare = {
  reducer: CaseReducer<MachineState, PayloadAction<unknown>>;
  prepare: PrepareAction<unknown>;
};

type MachineReducers = SliceCaseReducers<MachineState> & {
  // Overrides for reducers that don't take a payload.
  abort: WithPrepare;
  acquire: WithPrepare;
  applyStorageLayout: WithPrepare;
  checkPower: WithPrepare;
  commission: WithPrepare;
  createBcache: WithPrepare;
  createCacheSet: WithPrepare;
  createLogicalVolume: WithPrepare;
  createPartition: WithPrepare;
  createRaid: WithPrepare;
  createVmfsDatastore: WithPrepare;
  createVolumeGroup: WithPrepare;
  delete: WithPrepare;
  deleteCacheSet: WithPrepare;
  deleteDisk: WithPrepare;
  deleteFilesystem: WithPrepare;
  deletePartition: WithPrepare;
  deleteVolumeGroup: WithPrepare;
  deploy: WithPrepare;
  fetchComplete: CaseReducer<MachineState, PayloadAction<void>>;
  getStart: CaseReducer<MachineState, PayloadAction<void>>;
  rescueMode: WithPrepare;
  exitRescueMode: WithPrepare;
  lock: WithPrepare;
  markBroken: WithPrepare;
  markFixed: WithPrepare;
  mountSpecial: WithPrepare;
  overrideFailedTesting: WithPrepare;
  release: WithPrepare;
  setBootDisk: WithPrepare;
  setPool: WithPrepare;
  setZone: WithPrepare;
  suppressScriptResults: WithPrepare;
  tag: WithPrepare;
  test: WithPrepare;
  off: WithPrepare;
  on: WithPrepare;
  unlock: WithPrepare;
  unmountSpecial: WithPrepare;
  updateDisk: WithPrepare;
  updateFilesystem: WithPrepare;
  updateVmfsDatastore: WithPrepare;
};

/**
 * Wrap the updateError call so that the call is made with the correct generics.
 */
const setErrors = (
  state: MachineState,
  action: {
    payload: MachineState["errors"];
    type: string;
    meta: GenericItemMeta<Machine>;
    error?: boolean;
  },
  event: string
): MachineState =>
  updateErrors<MachineState, Machine, "system_id">(
    state,
    action,
    event,
    "system_id"
  );

const statusHandlers = generateStatusHandlers<
  MachineState,
  Machine,
  "system_id"
>(
  "machine",
  "system_id",
  ACTIONS.map((action) => {
    const handler: StatusHandlers<MachineState, Machine> = {
      status: kebabToCamelCase(action.name),
      method: "action",
      statusKey: action.status,
      prepare: (systemId: Machine["system_id"]) => ({
        action: action.name,
        extra: {},
        system_id: systemId,
      }),
    };
    switch (action.name) {
      case "apply-storage-layout":
        handler.method = "apply_storage_layout";
        handler.prepare = (
          systemId: Machine["system_id"],
          storageLayout: string
        ) => ({
          storage_layout: storageLayout,
          system_id: systemId,
        });
        break;
      case "check-power":
        handler.method = "check_power";
        handler.prepare = (systemId: Machine["system_id"]) => ({
          system_id: systemId,
        });
        break;
      case NodeActions.COMMISSION:
        handler.prepare = (
          systemId: Machine["system_id"],
          enableSSH: boolean,
          skipBMCConfig: boolean,
          skipNetworking: boolean,
          skipStorage: boolean,
          updateFirmware: boolean,
          configureHBA: boolean,
          commissioningScripts: Scripts[],
          testingScripts: Scripts[],
          scriptInputs: ScriptInput[]
        ) => {
          let formattedCommissioningScripts: (string | Scripts["id"])[] = [];
          if (commissioningScripts && commissioningScripts.length > 0) {
            formattedCommissioningScripts = commissioningScripts.map(
              (script) => script.id
            );
            if (updateFirmware) {
              formattedCommissioningScripts.push("update_firmware");
            }
            if (configureHBA) {
              formattedCommissioningScripts.push("configure_hba");
            }
          }
          return {
            action: action.name,
            system_id: systemId,
            extra: {
              enable_ssh: enableSSH,
              skip_bmc_config: skipBMCConfig,
              skip_networking: skipNetworking,
              skip_storage: skipStorage,
              commissioning_scripts: formattedCommissioningScripts,
              testing_scripts:
                testingScripts && testingScripts.map((script) => script.id),
              script_input: scriptInputs,
            },
          };
        };
        break;
      case "create-bcache":
        handler.method = "create_bcache";
        handler.prepare = (params: {
          blockId: number;
          cacheMode: string;
          cacheSetId: number;
          filesystemType: string;
          mountOptions: string;
          mountPoint: string;
          name: string;
          partitionId: number;
          systemId: Machine["system_id"];
          tags: string[];
        }) => ({
          block_id: params.blockId,
          cache_mode: params.cacheMode,
          cache_set: params.cacheSetId,
          fstype: params.filesystemType,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          name: params.name,
          partition_id: params.partitionId,
          system_id: params.systemId,
          tags: params.tags,
        });
        break;
      case "create-cache-set":
        handler.method = "create_cache_set";
        handler.prepare = (params: {
          blockId: number;
          partitionId: number;
          systemId: Machine["system_id"];
        }) => ({
          block_id: params.blockId,
          partition_id: params.partitionId,
          system_id: params.systemId,
        });
        break;
      case "create-logical-volume":
        handler.method = "create_logical_volume";
        handler.prepare = (params: {
          fstype?: string;
          mountOptions?: string;
          mountPoint?: string;
          name: string;
          size: number;
          systemId: Machine["system_id"];
          tags?: string[];
          volumeGroupId: number;
        }) => ({
          name: params.name,
          size: params.size,
          system_id: params.systemId,
          volume_group_id: params.volumeGroupId,
          ...("fstype" in params && { fstype: params.fstype }),
          ...("mountOptions" in params && {
            mount_options: params.mountOptions,
          }),
          ...("mountPoint" in params && { mount_point: params.mountPoint }),
          ...("tags" in params && { tags: params.tags }),
        });
        break;
      case "create-partition":
        handler.method = "create_partition";
        handler.prepare = (params: {
          blockId: number;
          filesystemType?: string;
          mountOptions?: string;
          mountPoint?: string;
          partitionSize: number;
          systemId: Machine["system_id"];
        }) => ({
          block_id: params.blockId,
          fstype: params.filesystemType,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          partition_size: params.partitionSize,
          system_id: params.systemId,
        });
        break;
      case "create-raid":
        handler.method = "create_raid";
        handler.prepare = (params: {
          blockDeviceIDs: number[];
          level: number;
          mountOptions: string;
          mountPoint: string;
          name: string;
          partitionIDs: number[];
          spareBlockDeviceIDs: number[];
          sparePartitionIDs: number[];
          systemId: Machine["system_id"];
          tags: string[];
        }) => ({
          block_devices: params.blockDeviceIDs,
          level: params.level,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          name: params.name,
          partitions: params.partitionIDs,
          spare_devices: params.spareBlockDeviceIDs,
          spare_partitions: params.sparePartitionIDs,
          system_id: params.systemId,
          tags: params.tags,
        });
        break;
      case "create-vmfs-datastore":
        handler.method = "create_vmfs_datastore";
        handler.prepare = (params: {
          blockDeviceIDs: number[];
          name: string;
          partitionIDs: number[];
          systemId: Machine["system_id"];
        }) => ({
          block_devices: params.blockDeviceIDs,
          name: params.name,
          partitions: params.partitionIDs,
          system_id: params.systemId,
        });
        break;
      case "create-volume-group":
        handler.method = "create_volume_group";
        handler.prepare = (params: {
          blockDeviceIds: number[];
          name: string;
          partitionIds: number[];
          systemId: Machine["system_id"];
        }) => ({
          name: params.name,
          system_id: params.systemId,
          ...("blockDeviceIds" in params && {
            block_devices: params.blockDeviceIds,
          }),
          ...("partitionIds" in params && { partitions: params.partitionIds }),
        });
        break;
      case "delete-cache-set":
        handler.method = "delete_cache_set";
        handler.prepare = (params: {
          cacheSetId: number;
          systemId: Machine["system_id"];
        }) => ({
          cache_set_id: params.cacheSetId,
          system_id: params.systemId,
        });
        break;
      case "delete-disk":
        handler.method = "delete_disk";
        handler.prepare = (params: {
          blockId: number;
          systemId: Machine["system_id"];
        }) => ({
          block_id: params.blockId,
          system_id: params.systemId,
        });
        break;
      case "delete-filesystem":
        handler.method = "delete_filesystem";
        handler.prepare = (params: {
          blockDeviceId?: number;
          filesystemId: number;
          partitionId?: number;
          systemId: Machine["system_id"];
        }) => ({
          system_id: params.systemId,
          filesystem_id: params.filesystemId,
          ...("blockDeviceId" in params && {
            blockdevice_id: params.blockDeviceId,
          }),
          ...("partitionId" in params && { partition_id: params.partitionId }),
        });
        break;
      case "delete-partition":
        handler.method = "delete_partition";
        handler.prepare = (params: {
          partitionId: number;
          systemId: Machine["system_id"];
        }) => ({
          partition_id: params.partitionId,
          system_id: params.systemId,
        });
        break;
      case "delete-volume-group":
        handler.method = "delete_volume_group";
        handler.prepare = (params: {
          systemId: Machine["system_id"];
          volumeGroupId: number;
        }) => ({
          system_id: params.systemId,
          volume_group_id: params.volumeGroupId,
        });
        break;
      case NodeActions.DEPLOY:
        handler.prepare = (systemId: Machine["system_id"], extra = {}) => ({
          action: action.name,
          extra,
          system_id: systemId,
        });
        break;
      case NodeActions.MARK_BROKEN:
        handler.prepare = (systemId: Machine["system_id"], message) => ({
          action: action.name,
          extra: { message },
          system_id: systemId,
        });
        break;
      case "mount-special":
        handler.method = "mount_special";
        handler.prepare = (params: {
          filesystemType: string;
          mountOptions: string;
          mountPoint: string;
          systemId: Machine["system_id"];
        }) => ({
          fstype: params.filesystemType,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          system_id: params.systemId,
        });
        break;
      case "set-boot-disk":
        handler.method = "set_boot_disk";
        handler.prepare = (params: {
          blockId: number;
          systemId: Machine["system_id"];
        }) => ({
          block_id: params.blockId,
          system_id: params.systemId,
        });
        break;
      case NodeActions.SET_POOL:
        handler.prepare = (systemId: Machine["system_id"], poolId) => ({
          action: action.name,
          extra: { pool_id: poolId },
          system_id: systemId,
        });
        break;
      case NodeActions.SET_ZONE:
        handler.prepare = (systemId: Machine["system_id"], zoneId) => ({
          action: action.name,
          extra: { zone_id: zoneId },
          system_id: systemId,
        });
        break;
      case NodeActions.TAG:
        handler.prepare = (systemId: Machine["system_id"], tags: string[]) => ({
          action: action.name,
          extra: {
            tags,
          },
          system_id: systemId,
        });
        break;
      case NodeActions.TEST:
        handler.prepare = (
          systemId: Machine["system_id"],
          scripts: Scripts[],
          enableSSH: boolean,
          scriptInputs: ScriptInput
        ) => ({
          action: action.name,
          extra: {
            enable_ssh: enableSSH,
            script_input: scriptInputs,
            testing_scripts: scripts && scripts.map((script) => script.id),
          },
          system_id: systemId,
        });
        break;
      case "unmount-special":
        handler.method = "unmount_special";
        handler.prepare = (params: {
          mountPoint: string;
          systemId: Machine["system_id"];
        }) => ({
          mount_point: params.mountPoint,
          system_id: params.systemId,
        });
        break;
      case "update-disk":
        handler.method = "update_disk";
        handler.prepare = (params: {
          blockId: number;
          fstype?: string;
          mountOptions?: string;
          mountPoint?: string;
          name?: string;
          systemId: Machine["system_id"];
          tags?: string[];
        }) => ({
          block_id: params.blockId,
          system_id: params.systemId,
          ...("fstype" in params && { fstype: params.fstype }),
          ...("mountOptions" in params && {
            mount_options: params.mountOptions,
          }),
          ...("mountPoint" in params && { mount_point: params.mountPoint }),
          ...("name" in params && { name: params.name }),
          ...("tags" in params && { tags: params.tags }),
        });
        break;
      case "update-filesystem":
        handler.method = "update_filesystem";
        handler.prepare = (params: {
          blockId?: number;
          fstype?: string;
          mountOptions?: string;
          mountPoint?: string;
          partitionId?: number;
          systemId: Machine["system_id"];
          tags?: string[];
        }) => ({
          system_id: params.systemId,
          ...("blockId" in params && { block_id: params.blockId }),
          ...("fstype" in params && { fstype: params.fstype }),
          ...("mountOptions" in params && {
            mount_options: params.mountOptions,
          }),
          ...("mountPoint" in params && { mount_point: params.mountPoint }),
          ...("partitionId" in params && { partition_id: params.partitionId }),
          ...("tags" in params && { tags: params.tags }),
        });
        break;
      case "update-vmfs-datastore":
        handler.method = "update_vmfs_datastore";
        handler.prepare = (params: {
          addBlockDeviceIDs: number[];
          addPartitionIDs: number[];
          name: string;
          systemId: Machine["system_id"];
          vmfsDatastoreId: number;
        }) => ({
          add_block_devices: params.addBlockDeviceIDs,
          add_partitions: params.addPartitionIDs,
          name: params.name,
          system_id: params.systemId,
          vmfs_datastore_id: params.vmfsDatastoreId,
        });
        break;
    }
    return handler;
  }),
  setErrors
) as MachineReducers;

export type MachineSlice = GenericSlice<MachineState, Machine, MachineReducers>;

const machineSlice = generateSlice<
  Machine,
  MachineState["errors"],
  MachineReducers,
  "system_id"
>({
  indexKey: "system_id",
  initialState: {
    active: null,
    selected: [],
    statuses: {},
  } as MachineState,
  name: "machine",
  reducers: {
    // Explicitly assign generated status handlers so that the dynamically
    // generated names exist on the reducers object.
    abort: statusHandlers.abort,
    abortStart: statusHandlers.abortStart,
    abortSuccess: statusHandlers.abortSuccess,
    abortError: statusHandlers.abortError,
    acquire: statusHandlers.acquire,
    acquireStart: statusHandlers.acquireStart,
    acquireSuccess: statusHandlers.acquireSuccess,
    acquireError: statusHandlers.acquireError,
    applyStorageLayout: statusHandlers.applyStorageLayout,
    applyStorageLayoutStart: statusHandlers.applyStorageLayoutStart,
    applyStorageLayoutSuccess: statusHandlers.applyStorageLayoutSuccess,
    applyStorageLayoutError: statusHandlers.applyStorageLayoutError,
    checkPower: statusHandlers.checkPower,
    checkPowerStart: statusHandlers.checkPowerStart,
    checkPowerSuccess: statusHandlers.checkPowerSuccess,
    checkPowerError: statusHandlers.checkPowerError,
    commission: statusHandlers.commission,
    commissionStart: statusHandlers.commissionStart,
    commissionSuccess: statusHandlers.commissionSuccess,
    commissionError: statusHandlers.commissionError,
    createBcache: statusHandlers.createBcache,
    createBcacheStart: statusHandlers.createBcacheStart,
    createBcacheSuccess: statusHandlers.createBcacheSuccess,
    createBcacheError: statusHandlers.createBcacheError,
    createCacheSet: statusHandlers.createCacheSet,
    createCacheSetStart: statusHandlers.createCacheSetStart,
    createCacheSetSuccess: statusHandlers.createCacheSetSuccess,
    createCacheSetError: statusHandlers.createCacheSetError,
    createLogicalVolume: statusHandlers.createLogicalVolume,
    createLogicalVolumeStart: statusHandlers.createLogicalVolumeStart,
    createLogicalVolumeSuccess: statusHandlers.createLogicalVolumeSuccess,
    createLogicalVolumeError: statusHandlers.createLogicalVolumeError,
    createPartition: statusHandlers.createPartition,
    createPartitionStart: statusHandlers.createPartitionStart,
    createPartitionSuccess: statusHandlers.createPartitionSuccess,
    createPartitionError: statusHandlers.createPartitionError,
    createRaid: statusHandlers.createRaid,
    createRaidStart: statusHandlers.createRaidStart,
    createRaidSuccess: statusHandlers.createRaidSuccess,
    createRaidError: statusHandlers.createRaidError,
    createVmfsDatastore: statusHandlers.createVmfsDatastore,
    createVmfsDatastoreStart: statusHandlers.createVmfsDatastoreStart,
    createVmfsDatastoreSuccess: statusHandlers.createVmfsDatastoreSuccess,
    createVmfsDatastoreError: statusHandlers.createVmfsDatastoreError,
    createVolumeGroup: statusHandlers.createVolumeGroup,
    createVolumeGroupStart: statusHandlers.createVolumeGroupStart,
    createVolumeGroupSuccess: statusHandlers.createVolumeGroupSuccess,
    createVolumeGroupError: statusHandlers.createVolumeGroupError,
    delete: statusHandlers.delete,
    deleteStart: statusHandlers.deleteStart,
    deleteSuccess: statusHandlers.deleteSuccess,
    deleteError: statusHandlers.deleteError,
    deleteCacheSet: statusHandlers.deleteCacheSet,
    deleteCacheSetStart: statusHandlers.deleteCacheSetStart,
    deleteCacheSetSuccess: statusHandlers.deleteCacheSetSuccess,
    deleteCacheSetError: statusHandlers.deleteCacheSetError,
    deleteDisk: statusHandlers.deleteDisk,
    deleteDiskStart: statusHandlers.deleteDiskStart,
    deleteDiskSuccess: statusHandlers.deleteDiskSuccess,
    deleteDiskError: statusHandlers.deleteDiskError,
    deleteFilesystem: statusHandlers.deleteFilesystem,
    deleteFilesystemStart: statusHandlers.deleteFilesystemStart,
    deleteFilesystemSuccess: statusHandlers.deleteFilesystemSuccess,
    deleteFilesystemError: statusHandlers.deleteFilesystemError,
    deletePartition: statusHandlers.deletePartition,
    deletePartitionStart: statusHandlers.deletePartitionStart,
    deletePartitionSuccess: statusHandlers.deletePartitionSuccess,
    deletePartitionError: statusHandlers.deletePartitionError,
    deleteVolumeGroup: statusHandlers.deleteVolumeGroup,
    deleteVolumeGroupStart: statusHandlers.deleteVolumeGroupStart,
    deleteVolumeGroupSuccess: statusHandlers.deleteVolumeGroupSuccess,
    deleteVolumeGroupError: statusHandlers.deleteVolumeGroupError,
    deploy: statusHandlers.deploy,
    deployStart: statusHandlers.deployStart,
    deploySuccess: statusHandlers.deploySuccess,
    deployError: statusHandlers.deployError,
    exitRescueMode: statusHandlers.exitRescueMode,
    exitRescueModeStart: statusHandlers.exitRescueModeStart,
    exitRescueModeSuccess: statusHandlers.exitRescueModeSuccess,
    exitRescueModeError: statusHandlers.exitRescueModeError,
    lock: statusHandlers.lock,
    lockStart: statusHandlers.lockStart,
    lockSuccess: statusHandlers.lockSuccess,
    lockError: statusHandlers.lockError,
    markBroken: statusHandlers.markBroken,
    markBrokenStart: statusHandlers.markBrokenStart,
    markBrokenSuccess: statusHandlers.markBrokenSuccess,
    markBrokenError: statusHandlers.markBrokenError,
    markFixed: statusHandlers.markFixed,
    markFixedStart: statusHandlers.markFixedStart,
    markFixedSuccess: statusHandlers.markFixedSuccess,
    markFixedError: statusHandlers.markFixedError,
    mountSpecial: statusHandlers.mountSpecial,
    mountSpecialStart: statusHandlers.mountSpecialStart,
    mountSpecialSuccess: statusHandlers.mountSpecialSuccess,
    mountSpecialError: statusHandlers.mountSpecialError,
    overrideFailedTesting: statusHandlers.overrideFailedTesting,
    overrideFailedTestingStart: statusHandlers.overrideFailedTestingStart,
    overrideFailedTestingSuccess: statusHandlers.overrideFailedTestingSuccess,
    overrideFailedTestingError: statusHandlers.overrideFailedTestingError,
    release: statusHandlers.release,
    releaseStart: statusHandlers.releaseStart,
    releaseSuccess: statusHandlers.releaseSuccess,
    releaseError: statusHandlers.releaseError,
    rescueMode: statusHandlers.rescueMode,
    rescueModeStart: statusHandlers.rescueModeStart,
    rescueModeSuccess: statusHandlers.rescueModeSuccess,
    rescueModeError: statusHandlers.rescueModeError,
    setBootDisk: statusHandlers.setBootDisk,
    setBootDiskStart: statusHandlers.setBootDiskStart,
    setBootDiskSuccess: statusHandlers.setBootDiskSuccess,
    setBootDiskError: statusHandlers.setBootDiskError,
    setPool: statusHandlers.setPool,
    setPoolStart: statusHandlers.setPoolStart,
    setPoolSuccess: statusHandlers.setPoolSuccess,
    setPoolError: statusHandlers.setPoolError,
    setZone: statusHandlers.setZone,
    setZoneStart: statusHandlers.setZoneStart,
    setZoneSuccess: statusHandlers.setZoneSuccess,
    setZoneError: statusHandlers.setZoneError,
    tag: statusHandlers.tag,
    tagStart: statusHandlers.tagStart,
    tagSuccess: statusHandlers.tagSuccess,
    tagError: statusHandlers.tagError,
    test: statusHandlers.test,
    testStart: statusHandlers.testStart,
    testSuccess: statusHandlers.testSuccess,
    testError: statusHandlers.testError,
    off: statusHandlers.off,
    offStart: statusHandlers.offStart,
    offSuccess: statusHandlers.offSuccess,
    offError: statusHandlers.offError,
    on: statusHandlers.on,
    onStart: statusHandlers.onStart,
    onSuccess: statusHandlers.onSuccess,
    onError: statusHandlers.onError,
    unlock: statusHandlers.unlock,
    unlockStart: statusHandlers.unlockStart,
    unlockSuccess: statusHandlers.unlockSuccess,
    unlockError: statusHandlers.unlockError,
    unmountSpecial: statusHandlers.unmountSpecial,
    unmountSpecialStart: statusHandlers.unmountSpecialStart,
    unmountSpecialSuccess: statusHandlers.unmountSpecialSuccess,
    unmountSpecialError: statusHandlers.unmountSpecialError,
    updateDisk: statusHandlers.updateDisk,
    updateDiskStart: statusHandlers.updateDiskStart,
    updateDiskSuccess: statusHandlers.updateDiskSuccess,
    updateDiskError: statusHandlers.updateDiskError,
    updateFilesystem: statusHandlers.updateFilesystem,
    updateFilesystemStart: statusHandlers.updateFilesystemStart,
    updateFilesystemSuccess: statusHandlers.updateFilesystemSuccess,
    updateFilesystemError: statusHandlers.updateFilesystemError,
    updateVmfsDatastore: statusHandlers.updateVmfsDatastore,
    updateVmfsDatastoreStart: statusHandlers.updateVmfsDatastoreStart,
    updateVmfsDatastoreSuccess: statusHandlers.updateVmfsDatastoreSuccess,
    updateVmfsDatastoreError: statusHandlers.updateVmfsDatastoreError,
    fetch: {
      prepare: () => ({
        meta: {
          model: "machine",
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
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = state.items.findIndex(
          (draftItem: Machine) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = newItem;
        } else {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.system_id] = DEFAULT_STATUSES;
        }
      });
    },
    get: {
      prepare: (machineID: Machine["system_id"]) => ({
        meta: {
          model: "machine",
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
    getStart: (state: MachineState) => {
      state.loading = true;
    },
    getError: (
      state: MachineState,
      action: PayloadAction<
        MachineState["errors"],
        string,
        GenericItemMeta<Machine>
      >
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "get");
      state.loading = false;
      state.saving = false;
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
    setActive: {
      prepare: (system_id: Machine["system_id"] | null) => ({
        meta: {
          model: "machine",
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
      action: PayloadAction<
        MachineState["errors"][0],
        string,
        GenericItemMeta<Machine>
      >
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
    addChassisStart: (state: MachineState) => {
      state.saved = false;
      state.saving = true;
    },
    addChassisError: (
      state: MachineState,
      action: PayloadAction<
        MachineState["errors"],
        string,
        GenericItemMeta<Machine>
      >
    ) => {
      state.errors = action.payload;
      state = setErrors(state, action, "addChassis");
      state.loading = false;
      state.saving = false;
    },
    addChassisSuccess: (state: MachineState) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
    },
    setSelected: {
      prepare: (machineIDs: Machine["system_id"][]) => ({
        payload: machineIDs,
      }),
      reducer: (
        state: MachineState,
        action: PayloadAction<Machine["system_id"][]>
      ) => {
        state.selected = action.payload;
      },
    },
    suppressScriptResults: {
      prepare: (machineID: Machine["system_id"], scripts: ScriptResult[]) => ({
        meta: {
          model: "machine",
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
    deleteNotify: (state: MachineState, action) => {
      const index = state.items.findIndex(
        (item: Machine) => item.system_id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (machineId: Machine["system_id"]) => machineId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
  },
  setErrors,
}) as MachineSlice;

export const { actions } = machineSlice;

export default machineSlice.reducer;
