import type { KVMHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";
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

type HeaderViews = typeof KVMHeaderViews;

export type KVMHeaderContent =
  | HeaderContent<HeaderViews["COMPOSE_VM"], { hostId?: Pod["id"] }>
  | HeaderContent<
      HeaderViews["DELETE_KVM"],
      { clusterId?: VMCluster[VMClusterMeta.PK]; hostId?: Pod["id"] }
    >
  | HeaderContent<HeaderViews["ADD_LXD_HOST"] | HeaderViews["ADD_VIRSH_HOST"]>
  | HeaderContent<HeaderViews["REFRESH_KVM"], { hostIds?: Pod["id"][] }>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type KVMResource = PodResource | VMClusterResource;

export type KVMStoragePoolResources =
  | PodStoragePoolResources
  | VMClusterStoragePoolResources;

export type KVMStoragePoolResource =
  | PodStoragePoolResource
  | VMClusterStoragePoolResource;
