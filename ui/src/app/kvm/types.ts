import type { ValueOf } from "@canonical/react-components";

import type { KVMHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";

export type KVMHeaderContent =
  | HeaderContent<ValueOf<typeof KVMHeaderViews>>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type KVMResource = {
  allocated_other: number;
  allocated_tracked: number;
  free: number;
};
