import type { ValueOf } from "@canonical/react-components";

import type { KVMHeaderNames } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";

export type KVMHeaderContent =
  | HeaderContent<ValueOf<typeof KVMHeaderNames>>
  | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;
