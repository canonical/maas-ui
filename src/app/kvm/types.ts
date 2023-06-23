import type { KVMSidePanelViews } from "./constants";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { MachineSidePanelContent } from "app/machines/types";
import type {
  Pod,
  PodResource,
  PodStoragePoolResource,
  PodStoragePoolResources,
} from "app/store/pod/types";
import type {
  VMCluster,
  VMClusterMeta,
  VMClusterResource,
  VMClusterStoragePoolResource,
  VMClusterStoragePoolResources,
} from "app/store/vmcluster/types";

type HeaderViews = typeof KVMSidePanelViews;

export type KVMSidePanelContent =
  | SidePanelContent<HeaderViews["COMPOSE_VM"], { hostId?: Pod["id"] }>
  | SidePanelContent<
      HeaderViews["DELETE_KVM"],
      { clusterId?: VMCluster[VMClusterMeta.PK]; hostId?: Pod["id"] }
    >
  | SidePanelContent<
      HeaderViews["ADD_LXD_HOST"] | HeaderViews["ADD_VIRSH_HOST"]
    >
  | SidePanelContent<HeaderViews["REFRESH_KVM"], { hostIds?: Pod["id"][] }>
  | MachineSidePanelContent;

export type KVMSetSidePanelContent = SetSidePanelContent<KVMSidePanelContent>;

export type KVMResource = PodResource | VMClusterResource;

export type KVMStoragePoolResources =
  | PodStoragePoolResources
  | VMClusterStoragePoolResources;

export type KVMStoragePoolResource =
  | PodStoragePoolResource
  | VMClusterStoragePoolResource;
