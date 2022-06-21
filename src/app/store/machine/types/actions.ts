import type { Machine, MachineStatus } from "./base";
import type { MachineMeta } from "./enum";

import type { Domain } from "app/store/domain/types";
import type { LicenseKeys } from "app/store/licensekeys/types";
import type {
  ResourcePool,
  ResourcePoolMeta,
} from "app/store/resourcepool/types";
import type { Script, ScriptName } from "app/store/script/types";
import type { Subnet } from "app/store/subnet/types";
import type { Tag, TagMeta } from "app/store/tag/types";
import type {
  DiskTypes,
  NetworkLinkMode,
  StorageLayout,
} from "app/store/types/enum";
import type {
  BaseNodeActionParams,
  LinkParams,
  NetworkInterface,
  NetworkInterfaceParams,
  NetworkLink,
  PowerParameters,
  ScriptInputParam,
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

export type CloneParams = BaseNodeActionParams & {
  destinations: Machine[MachineMeta.PK][];
  interfaces: boolean;
  storage: boolean;
};

export type CommissionParams = BaseNodeActionParams & {
  commissioning_scripts?: Script["name"][];
  enable_ssh?: boolean;
  script_input?: ScriptInputParam;
  skip_bmc_config?: boolean;
  skip_networking?: boolean;
  skip_storage?: boolean;
  testing_scripts?: Script["name"][] | [ScriptName.NONE];
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
  domain?: { name: Domain["name"] };
  ephemeral_deploy?: boolean;
  extra_macs: Machine["extra_macs"];
  hostname?: Machine["hostname"];
  hwe_kernel?: string;
  install_rackd?: boolean;
  license_key?: LicenseKeys["license_key"];
  memory?: Machine["memory"];
  min_hwe_kernel?: string;
  osystem?: Machine["osystem"];
  pool?: { name: ResourcePool["name"] };
  power_parameters: PowerParameters;
  power_type: Machine["power_type"];
  pxe_mac: Machine["pxe_mac"];
  swap_size?: string;
  zone?: { name: Zone["name"] };
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

export type DeployParams = BaseNodeActionParams & {
  distro_series?: Machine["distro_series"];
  enable_hw_sync?: boolean;
  hwe_kernel?: string;
  install_kvm?: boolean;
  osystem?: Machine["osystem"];
  register_vmhost?: boolean;
  user_data?: string;
};

export type GetSummaryXmlParams = {
  systemId: Machine[MachineMeta.PK];
  fileId: string;
};

export type GetSummaryYamlParams = {
  systemId: Machine[MachineMeta.PK];
  fileId: string;
};

export type LinkSubnetParams = {
  interface_id: NetworkInterface["id"];
  ip_address?: NetworkLink["ip_address"];
  link_id?: NetworkLink["id"];
  mode: NetworkLinkMode;
  subnet?: Subnet["id"];
  system_id: Machine[MachineMeta.PK];
};

export type MarkBrokenParams = BaseNodeActionParams & {
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

export type ReleaseParams = BaseNodeActionParams & {
  erase?: boolean;
  quick_erase?: boolean;
  secure_erase?: boolean;
};

export type SetBootDiskParams = {
  blockId: number;
  systemId: Machine[MachineMeta.PK];
};

export type SetPoolParams = BaseNodeActionParams & {
  pool_id: ResourcePool[ResourcePoolMeta.PK];
};

export type TagParams = BaseNodeActionParams & {
  tags: Tag[TagMeta.PK][];
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

export type UntagParams = BaseNodeActionParams & {
  tags: Tag[TagMeta.PK][];
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

export type UpdateParams = Partial<CreateParams> & {
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

export type ListParams = {
  group_collapsed?: string[];
  group_key?: string;
  page_number: number;
  page_size: number;
  sort_direction?: "ascending" | "descending";
  sort_key?: string;
};

export type ListResponseGroup = {
  collapsed: boolean;
  count: number;
  items: Machine[];
  name: string;
};

export type ListResponse = {
  count: number;
  cur_page: number;
  items: Machine[] | ListResponseGroup[];
  num_pages: number;
};

export type FilterGroupsResponse = {
  dynamic: boolean;
  for_grouping: boolean;
  key: string;
  label: string;
}[];

export type FilterOptionsParams = {
  group_key: string;
};

export type FilterOptionsResponse = {
  key: string;
  label: string;
}[];

export type UnsubscribeParams = {
  system_ids: Machine[MachineMeta.PK][];
};
