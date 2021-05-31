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
} from "./types";

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

type UpdateMachine = Partial<
  Omit<Machine, "pool" | "zone"> & {
    pool: { name: string };
    zone: { name: string };
  }
>;

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
  MachineMeta.MODEL,
  MachineMeta.PK,
  ACTIONS.map((action) => {
    const handler: StatusHandlers<MachineState, Machine> = {
      status: kebabToCamelCase(action.name),
      method: "action",
      statusKey: action.status,
      prepare: (systemId: Machine[MachineMeta.PK]) => ({
        action: action.name,
        extra: {},
        system_id: systemId,
      }),
    };
    switch (action.name) {
      case "apply-storage-layout":
        handler.method = "apply_storage_layout";
        handler.prepare = (params: {
          systemId: Machine[MachineMeta.PK];
          storageLayout: StorageLayout;
        }) => ({
          storage_layout: params.storageLayout,
          system_id: params.systemId,
        });
        break;
      case "check-power":
        handler.method = "check_power";
        handler.prepare = (systemId: Machine[MachineMeta.PK]) => ({
          system_id: systemId,
        });
        break;
      case NodeActions.COMMISSION:
        handler.prepare = ({
          systemId,
          enableSSH,
          skipBMCConfig,
          skipNetworking,
          skipStorage,
          updateFirmware,
          configureHBA,
          commissioningScripts,
          testingScripts,
          scriptInputs,
        }: {
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
        }) =>
          generateParams(params, {
            cacheMode: "cache_mode",
            cacheSetId: "cache_set",
            systemId: MachineMeta.PK,
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionId: "partition_id",
          });
        break;
      case "create-bond":
        handler.method = "create_bond";
        handler.prepare = (
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
        ) => generateParams(params);
        break;
      case "create-bridge":
        handler.method = "create_bridge";
        handler.prepare = (
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
        ) => generateParams(params);
        break;
      case "create-cache-set":
        handler.method = "create_cache_set";
        handler.prepare = (params: {
          blockId?: number;
          partitionId?: number;
          systemId: Machine[MachineMeta.PK];
        }) =>
          generateParams(params, {
            blockId: "block_id",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
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
          systemId: Machine[MachineMeta.PK];
          tags?: string[];
          volumeGroupId: number;
        }) =>
          generateParams(params, {
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            systemId: MachineMeta.PK,
            volumeGroupId: "volume_group_id",
          });
        break;
      case "create-partition":
        handler.method = "create_partition";
        handler.prepare = (params: {
          blockId: number;
          fstype?: string;
          mountOptions?: string;
          mountPoint?: string;
          partitionSize: number;
          systemId: Machine[MachineMeta.PK];
        }) => ({
          block_id: params.blockId,
          fstype: params.fstype,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          partition_size: params.partitionSize,
          system_id: params.systemId,
        });
        break;
      case "create-physical":
        handler.method = "create_physical";
        handler.prepare = (
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
        ) => generateParams(params);
        break;
      case "create-raid":
        handler.method = "create_raid";
        handler.prepare = (params: {
          blockDeviceIds?: number[];
          fstype?: string;
          level: number;
          mountOptions?: string;
          mountPoint?: string;
          name: string;
          partitionIds?: number[];
          spareBlockDeviceIds?: number[];
          sparePartitionIds?: number[];
          systemId: Machine[MachineMeta.PK];
          tags?: string[];
        }) =>
          generateParams(params, {
            blockDeviceIds: "block_devices",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionIds: "partitions",
            spareBlockDeviceIds: "spare_devices",
            sparePartitionIds: "spare_partitions",
            systemId: MachineMeta.PK,
          });
        break;
      case "create-vlan":
        handler.method = "create_vlan";
        handler.prepare = (
          params: {
            interface_speed?: NetworkInterface["interface_speed"];
            link_connected?: NetworkInterface["link_connected"];
            link_speed?: NetworkInterface["link_speed"];
            parent: NetworkInterface["parents"][0];
            system_id: Machine[MachineMeta.PK];
            tags?: NetworkInterface["tags"];
            vlan?: NetworkInterface["vlan_id"];
          } & LinkParams
        ) => generateParams(params);
        break;
      case "create-vmfs-datastore":
        handler.method = "create_vmfs_datastore";
        handler.prepare = (params: {
          blockDeviceIds?: number[];
          name: string;
          partitionIds?: number[];
          systemId: Machine[MachineMeta.PK];
        }) =>
          generateParams(params, {
            blockDeviceIds: "block_devices",
            partitionIds: "partitions",
            systemId: MachineMeta.PK,
          });
        break;
      case "create-volume-group":
        handler.method = "create_volume_group";
        handler.prepare = (params: {
          blockDeviceIds: number[];
          name: string;
          partitionIds: number[];
          systemId: Machine[MachineMeta.PK];
        }) =>
          generateParams(params, {
            blockDeviceIds: "block_devices",
            partitionIds: "partitions",
            systemId: MachineMeta.PK,
          });
        break;
      case "delete-cache-set":
        handler.method = "delete_cache_set";
        handler.prepare = (params: {
          cacheSetId: number;
          systemId: Machine[MachineMeta.PK];
        }) => ({
          cache_set_id: params.cacheSetId,
          system_id: params.systemId,
        });
        break;
      case "delete-disk":
        handler.method = "delete_disk";
        handler.prepare = (params: {
          blockId: number;
          systemId: Machine[MachineMeta.PK];
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
          systemId: Machine[MachineMeta.PK];
        }) =>
          generateParams(params, {
            blockDeviceId: "blockdevice_id",
            filesystemId: "filesystem_id",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
          });
        break;
      case "delete-interface":
        handler.method = "delete_interface";
        handler.prepare = (params: {
          interfaceId: NetworkInterface["id"];
          systemId: Machine[MachineMeta.PK];
        }) => ({
          interface_id: params.interfaceId,
          system_id: params.systemId,
        });
        break;
      case "delete-partition":
        handler.method = "delete_partition";
        handler.prepare = (params: {
          partitionId: number;
          systemId: Machine[MachineMeta.PK];
        }) => ({
          partition_id: params.partitionId,
          system_id: params.systemId,
        });
        break;
      case "delete-volume-group":
        handler.method = "delete_volume_group";
        handler.prepare = (params: {
          systemId: Machine[MachineMeta.PK];
          volumeGroupId: number;
        }) => ({
          system_id: params.systemId,
          volume_group_id: params.volumeGroupId,
        });
        break;
      case NodeActions.DEPLOY:
        handler.prepare = ({
          systemId,
          extra,
        }: {
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
          action: action.name,
          extra: extra || {},
          system_id: systemId,
        });
        break;
      case "get-summary-xml":
        handler.method = "get_summary_xml";
        handler.prepare = ({
          systemId,
        }: {
          systemId: Machine[MachineMeta.PK];
          fileId: string;
        }) => ({
          system_id: systemId,
        });
        handler.prepareMeta = ({
          fileId,
        }: {
          systemId: Machine[MachineMeta.PK];
          fileId: string;
        }) => ({
          // This request needs to store the results in the file context.
          fileContextKey: fileId,
          useFileContext: true,
        });
        break;
      case "get-summary-yaml":
        handler.method = "get_summary_yaml";
        handler.prepare = ({
          systemId,
        }: {
          systemId: Machine[MachineMeta.PK];
          fileId: string;
        }) => ({
          system_id: systemId,
        });
        handler.prepareMeta = ({
          fileId,
        }: {
          systemId: Machine[MachineMeta.PK];
          fileId: string;
        }) => ({
          // This request needs to store the results in the file context.
          fileContextKey: fileId,
          useFileContext: true,
        });
        break;
      case "link-subnet":
        handler.method = "link_subnet";
        handler.prepare = (params: {
          interface_id: NetworkInterface["id"];
          ip_address?: NetworkLink["ip_address"];
          link_id?: NetworkLink["id"];
          mode: NetworkLinkMode;
          subnet?: Subnet["id"];
          system_id: Machine[MachineMeta.PK];
        }) => generateParams(params);
        break;
      case NodeActions.MARK_BROKEN:
        handler.prepare = ({
          systemId,
          message,
        }: {
          systemId: Machine[MachineMeta.PK];
          message: string;
        }) => ({
          action: action.name,
          extra: { message },
          system_id: systemId,
        });
        break;
      case "mount-special":
        handler.method = "mount_special";
        handler.prepare = (params: {
          fstype: string;
          mountOptions: string;
          mountPoint: string;
          systemId: Machine[MachineMeta.PK];
        }) => ({
          fstype: params.fstype,
          mount_options: params.mountOptions,
          mount_point: params.mountPoint,
          system_id: params.systemId,
        });
        break;
      case NodeActions.RELEASE:
        handler.prepare = ({
          systemId,
          extra = {},
        }: {
          systemId: Machine[MachineMeta.PK];
          extra: {
            erase?: boolean;
            quick_erase?: boolean;
            secure_erase?: boolean;
          };
        }) => ({
          action: action.name,
          extra,
          system_id: systemId,
        });
        break;
      case "set-boot-disk":
        handler.method = "set_boot_disk";
        handler.prepare = (params: {
          blockId: number;
          systemId: Machine[MachineMeta.PK];
        }) => ({
          block_id: params.blockId,
          system_id: params.systemId,
        });
        break;
      case NodeActions.SET_POOL:
        handler.prepare = ({
          systemId,
          poolId,
        }: {
          systemId: Machine[MachineMeta.PK];
          poolId: ResourcePool["id"];
        }) => ({
          action: action.name,
          extra: { pool_id: poolId },
          system_id: systemId,
        });
        break;
      case NodeActions.SET_ZONE:
        handler.prepare = ({
          systemId,
          zoneId,
        }: {
          systemId: Machine[MachineMeta.PK];
          zoneId: Zone["id"];
        }) => ({
          action: action.name,
          extra: { zone_id: zoneId },
          system_id: systemId,
        });
        break;
      case NodeActions.TAG:
        handler.prepare = ({
          systemId,
          tags,
        }: {
          systemId: Machine[MachineMeta.PK];
          tags: string[];
        }) => ({
          action: action.name,
          extra: {
            tags,
          },
          system_id: systemId,
        });
        break;
      case NodeActions.TEST:
        handler.prepare = (params: {
          systemId: Machine[MachineMeta.PK];
          scripts?: Script[];
          enableSSH: boolean;
          scriptInputs: ScriptInput;
        }) => ({
          action: action.name,
          extra: {
            enable_ssh: params.enableSSH,
            script_input: params.scriptInputs,
            testing_scripts:
              params.scripts && params.scripts.map((script) => script.id),
          },
          system_id: params.systemId,
        });
        break;
      case "unlink-subnet":
        handler.method = "unlink_subnet";
        handler.prepare = (params: {
          interfaceId: NetworkInterface["id"];
          linkId: NetworkLink["id"];
          systemId: Machine[MachineMeta.PK];
        }) => ({
          interface_id: params.interfaceId,
          link_id: params.linkId,
          system_id: params.systemId,
        });
        break;
      case "unmount-special":
        handler.method = "unmount_special";
        handler.prepare = (params: {
          mountPoint: string;
          systemId: Machine[MachineMeta.PK];
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
          systemId: Machine[MachineMeta.PK];
          tags?: string[];
        }) =>
          generateParams(params, {
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            systemId: MachineMeta.PK,
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
          systemId: Machine[MachineMeta.PK];
          tags?: string[];
        }) =>
          generateParams(params, {
            blockId: "block_id",
            mountOptions: "mount_options",
            mountPoint: "mount_point",
            partitionId: "partition_id",
            systemId: MachineMeta.PK,
          });
        break;
      case "update-interface":
        handler.method = "update_interface";
        handler.prepare = (
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
            parent: NetworkInterface["parents"][0];
            parents?: NetworkInterface["parents"];
            system_id: Machine[MachineMeta.PK];
            tags?: NetworkInterface["tags"];
            vlan?: NetworkInterface["vlan_id"];
          } & LinkParams
        ) => generateParams(params);
        break;
      case "update-vmfs-datastore":
        handler.method = "update_vmfs_datastore";
        handler.prepare = (params: {
          blockDeviceIds: number[];
          name: string;
          partitionIds: number[];
          systemId: Machine[MachineMeta.PK];
          vmfsDatastoreId: number;
        }) =>
          generateParams(params, {
            blockDeviceIds: "add_block_devices",
            partitionIds: "add_partitions",
            systemId: MachineMeta.PK,
            vmfsDatastoreId: "vmfs_datastore_id",
          });
        break;
    }
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
    ...generateCommonReducers<MachineState, MachineMeta.PK>(
      MachineMeta.MODEL,
      MachineMeta.PK,
      setErrors
    ),
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
    createBond: statusHandlers.createBond,
    createBondStart: statusHandlers.createBondStart,
    createBondSuccess: statusHandlers.createBondSuccess,
    createBondError: statusHandlers.createBondError,
    createBridge: statusHandlers.createBridge,
    createBridgeStart: statusHandlers.createBridgeStart,
    createBridgeSuccess: statusHandlers.createBridgeSuccess,
    createBridgeError: statusHandlers.createBridgeError,
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
    createPhysical: statusHandlers.createPhysical,
    createPhysicalStart: statusHandlers.createPhysicalStart,
    createPhysicalSuccess: statusHandlers.createPhysicalSuccess,
    createPhysicalError: statusHandlers.createPhysicalError,
    createRaid: statusHandlers.createRaid,
    createRaidStart: statusHandlers.createRaidStart,
    createRaidSuccess: statusHandlers.createRaidSuccess,
    createRaidError: statusHandlers.createRaidError,
    createVlan: statusHandlers.createVlan,
    createVlanStart: statusHandlers.createVlanStart,
    createVlanSuccess: statusHandlers.createVlanSuccess,
    createVlanError: statusHandlers.createVlanError,
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
    deleteInterface: statusHandlers.deleteInterface,
    deleteInterfaceStart: statusHandlers.deleteInterfaceStart,
    deleteInterfaceSuccess: statusHandlers.deleteInterfaceSuccess,
    deleteInterfaceError: statusHandlers.deleteInterfaceError,
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
    getSummaryXml: statusHandlers.getSummaryXml,
    getSummaryXmlStart: statusHandlers.getSummaryXmlStart,
    getSummaryXmlSuccess: statusHandlers.getSummaryXmlSuccess,
    getSummaryXmlError: statusHandlers.getSummaryXmlError,
    getSummaryYaml: statusHandlers.getSummaryYaml,
    getSummaryYamlStart: statusHandlers.getSummaryYamlStart,
    getSummaryYamlSuccess: statusHandlers.getSummaryYamlSuccess,
    getSummaryYamlError: statusHandlers.getSummaryYamlError,
    linkSubnet: statusHandlers.linkSubnet,
    linkSubnetStart: statusHandlers.linkSubnetStart,
    linkSubnetSuccess: statusHandlers.linkSubnetSuccess,
    linkSubnetError: statusHandlers.linkSubnetError,
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
    unlinkSubnet: statusHandlers.unlinkSubnet,
    unlinkSubnetStart: statusHandlers.unlinkSubnetStart,
    unlinkSubnetSuccess: statusHandlers.unlinkSubnetSuccess,
    unlinkSubnetError: statusHandlers.unlinkSubnetError,
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
    updateInterface: statusHandlers.updateInterface,
    updateInterfaceStart: statusHandlers.updateInterfaceStart,
    updateInterfaceSuccess: statusHandlers.updateInterfaceSuccess,
    updateInterfaceError: statusHandlers.updateInterfaceError,
    updateVmfsDatastore: statusHandlers.updateVmfsDatastore,
    updateVmfsDatastoreStart: statusHandlers.updateVmfsDatastoreStart,
    updateVmfsDatastoreSuccess: statusHandlers.updateVmfsDatastoreSuccess,
    updateVmfsDatastoreError: statusHandlers.updateVmfsDatastoreError,
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
    getStart: (state: MachineState) => {
      state.loading = true;
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
      action: PayloadAction<MachineState["errors"]>
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
    deleteNotify: (state: MachineState, action) => {
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
    update: {
      prepare: (params: UpdateMachine) => ({
        meta: {
          model: MachineMeta.MODEL,
          method: "update",
        },
        payload: {
          params,
        },
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
  },
});

export const { actions } = machineSlice;

export default machineSlice.reducer;
