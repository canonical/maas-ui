import type { ValueOf } from "@canonical/react-components";

import type { KVMHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";
import type { Pod, PodResource } from "app/store/pod/types";
import type { VMClusterResource } from "app/store/vmcluster/types";

export type KVMHeaderContent =
  | HeaderContent<ValueOf<typeof KVMHeaderViews>, { hostId?: Pod["id"] }>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type KVMResource = PodResource | VMClusterResource;
