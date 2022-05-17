import type { Machine, MachineStatus } from "./base";
import type { DiskTypes, MachineMeta, StorageLayout } from "./enum";

import type { LicenseKeys } from "app/store/licensekeys/types";
import type { ResourcePool } from "app/store/resourcepool/types";
import type { Script } from "app/store/script/types";
import type { Subnet } from "app/store/subnet/types";
import type { NetworkLinkMode } from "app/store/types/enum";
import type {
  NetworkInterface,
  NetworkInterfaceParams,
  NetworkLink,
} from "app/store/types/node";
import type { Zone } from "app/store/zone/types";

export type Action = {
  name: string;
  status: keyof MachineStatus;
};

export type ApplyStorageLayoutParams = {
  systemId: Machine[MachineMeta.PK];
  storageLayout: StorageLayout;
};

export type CloneParams = {
  destinations: Machine[MachineMeta.PK][];
  interfaces: boolean;
  storage: boolean;
  system_id: Machine[MachineMeta.PK];
};

export type CommissionParams = {
  systemId: Machine[MachineMeta.PK];
  enableSSH?: boolean;
  skipBMCConfig?: boolean;
  skipNetworking?: boolean;
  skipStorage?: boolean;
  updateFirmware?: boolean;
  configureHBA?: boolean;
  commissioningScripts?: Script[];
  testingScripts?: Script[];
  scriptInputs?: ScriptInput;
};

export type CreateBcacheParams = {
  blockId?: number;
  cacheMode: string;
  cacheSetId: number;
  name: string;
  partitionId?: number;
  systemId: Machine[MachineMeta.PK];
  tags?: string[];
} & OptionalFilesystemParams;

export type CreateBondParams = {
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
} & LinkParams;

export type CreateBridgeParams = {
  bridge_fd?: NetworkInterfaceParams["bridge_fd"];
  bridge_stp?: NetworkInterfaceParams["bridge_stp"];
  bridge_type: NetworkInterfaceParams["bridge_type"];
  interface_speed?: NetworkInterface["interface_speed"];
  link_connected?: NetworkInterface["link_connected"];
  link_speed?: NetworkInterface["link_speed"];
  mac_address: NetworkInterface["mac_address"];
  name: NetworkInterface["name"];
  parents: NetworkInterface["parents"];
  system_id: Machine[MachineMeta.PK];
  tags?: NetworkInterface["tags"];
  vlan?: NetworkInterface["vlan_id"];
} & LinkParams;

export type CreateCacheSetParams = {
  blockId?: number;
  partitionId?: number;
  systemId: Machine[MachineMeta.PK];
};

export type CreateLogicalVolumeParams = {
  name: string;
  size: number;
  systemId: Machine[MachineMeta.PK];
  tags?: string[];
  volumeGroupId: number;
} & OptionalFilesystemParams;

export type CreateParams = {
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

export type CreatePartitionParams = {
  blockId: number;
  partitionSize: number;
  systemId: Machine[MachineMeta.PK];
} & OptionalFilesystemParams;

export type CreatePhysicalParams = {
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
} & LinkParams;

export type CreateRaidParams = {
  blockDeviceIds?: number[];
  level: DiskTypes;
  name: string;
  partitionIds?: number[];
  spareBlockDeviceIds?: number[];
  sparePartitionIds?: number[];
  systemId: Machine[MachineMeta.PK];
  tags?: string[];
} & OptionalFilesystemParams;

export type CreateVlanParams = {
  interface_speed?: NetworkInterface["interface_speed"];
  link_connected?: NetworkInterface["link_connected"];
  link_speed?: NetworkInterface["link_speed"];
  parent: NetworkInterface["parents"][0];
  system_id: Machine[MachineMeta.PK];
  tags?: NetworkInterface["tags"];
  vlan?: NetworkInterface["vlan_id"];
} & LinkParams;

export type CreateVmfsDatastoreParams = {
  blockDeviceIds?: number[];
  name: string;
  partitionIds?: number[];
  systemId: Machine[MachineMeta.PK];
};

export type CreateVolumeGroupParams = {
  blockDeviceIds?: number[];
  name: string;
  partitionIds?: number[];
  systemId: Machine[MachineMeta.PK];
};

export type DeleteCacheSetParams = {
  cacheSetId: number;
  systemId: Machine[MachineMeta.PK];
};

export type DeleteDiskParams = {
  blockId: number;
  systemId: Machine[MachineMeta.PK];
};

export type DeleteFilesystemParams = {
  blockDeviceId?: number;
  filesystemId: number;
  partitionId?: number;
  systemId: Machine[MachineMeta.PK];
};

export type DeleteInterfaceParams = {
  interfaceId: NetworkInterface["id"];
  systemId: Machine[MachineMeta.PK];
};

export type DeletePartitionParams = {
  partitionId: number;
  systemId: Machine[MachineMeta.PK];
};

export type DeleteVolumeGroupParams = {
  systemId: Machine[MachineMeta.PK];
  volumeGroupId: number;
};

export type DeployParams = {
  systemId: Machine[MachineMeta.PK];
  extra?: {
    osystem: Machine["osystem"];
    distro_series: Machine["distro_series"];
    hwe_kernel: string;
    register_vmhost?: boolean;
    install_kvm?: boolean;
    user_data?: string;
  };
};

export type GetSummaryXmlParams = {
  systemId: Machine[MachineMeta.PK];
  fileId: string;
};

export type GetSummaryYamlParams = {
  systemId: Machine[MachineMeta.PK];
  fileId: string;
};

// Common params for methods that can accept a link.
export type LinkParams = {
  default_gateway?: boolean;
  ip_address?: NetworkLink["ip_address"];
  mode?: NetworkLinkMode;
  subnet?: Subnet["id"];
};

export type LinkSubnetParams = {
  interface_id: NetworkInterface["id"];
  ip_address?: NetworkLink["ip_address"];
  link_id?: NetworkLink["id"];
  mode: NetworkLinkMode;
  subnet?: Subnet["id"];
  system_id: Machine[MachineMeta.PK];
};

export type MarkBrokenParams = {
  systemId: Machine[MachineMeta.PK];
  message?: string;
};

export type MountSpecialParams = {
  fstype: string;
  mountOptions: string;
  mountPoint: string;
  systemId: Machine[MachineMeta.PK];
};

export type OptionalFilesystemParams = {
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
};

export type ReleaseParams = {
  systemId: Machine[MachineMeta.PK];
  extra?: {
    erase?: boolean;
    quick_erase?: boolean;
    secure_erase?: boolean;
  };
};

export type ScriptInput = {
  [x: string]: { url: string };
};

export type SetBootDiskParams = {
  blockId: number;
  systemId: Machine[MachineMeta.PK];
};

export type SetPoolParams = {
  systemId: Machine[MachineMeta.PK];
  poolId: ResourcePool["id"];
};

export type SetZoneParams = {
  systemId: Machine[MachineMeta.PK];
  zoneId: Zone["id"];
};

export type TagParams = {
  systemId: Machine[MachineMeta.PK];
  tags: string[];
};

export type TestParams = {
  systemId: Machine[MachineMeta.PK];
  scripts?: Script[];
  enableSSH?: boolean;
  scriptInputs?: ScriptInput;
};

export type UnlinkSubnetParams = {
  interfaceId: NetworkInterface["id"];
  linkId: NetworkLink["id"];
  systemId: Machine[MachineMeta.PK];
};

export type UnmountSpecialParams = {
  mountPoint: string;
  systemId: Machine[MachineMeta.PK];
};

export type UpdateDiskParams = {
  blockId: number;
  name?: string;
  systemId: Machine[MachineMeta.PK];
  tags?: string[];
} & OptionalFilesystemParams;

export type UpdateFilesystemParams = {
  blockId?: number;
  partitionId?: number;
  systemId: Machine[MachineMeta.PK];
  tags?: string[];
} & OptionalFilesystemParams;

export type UpdateInterfaceParams = {
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
} & LinkParams;

export type UpdateParams = CreateParams & {
  [MachineMeta.PK]: Machine[MachineMeta.PK];
  tags?: Machine["tags"];
};

export type UpdateVmfsDatastoreParams = {
  blockDeviceIds?: number[];
  name?: string;
  partitionIds?: number[];
  systemId: Machine[MachineMeta.PK];
  vmfsDatastoreId?: number;
};
