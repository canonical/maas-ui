import type { KVMHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";
import type { Pod, PodResource } from "app/store/pod/types";
import type { VMClusterResource } from "app/store/vmcluster/types";

type HeaderViews = typeof KVMHeaderViews;

export type KVMHeaderContent =
  | HeaderContent<
      HeaderViews["COMPOSE_VM"] | HeaderViews["DELETE_KVM"],
      { hostId?: Pod["id"] }
    >
  | HeaderContent<HeaderViews["ADD_LXD_HOST"] | HeaderViews["ADD_VIRSH_HOST"]>
  | HeaderContent<HeaderViews["REFRESH_KVM"], { hostIds?: Pod["id"][] }>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type KVMResource = PodResource | VMClusterResource;
