import type { ValueOf } from "@canonical/react-components";

import type { KVMHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";
import type { Pod } from "app/store/pod/types";

export type KVMHeaderContent =
  | HeaderContent<ValueOf<typeof KVMHeaderViews>, { hostId?: Pod["id"] }>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type KVMResource = {
  allocated_other: number;
  allocated_tracked: number;
  free: number;
};
