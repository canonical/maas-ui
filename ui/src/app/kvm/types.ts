import type { SetHeaderContent } from "app/base/types";
import type { MachineHeaderContent } from "app/machines/types";
import type { PodAction } from "app/store/pod/types";

export type KVMHeaderContent = PodAction | MachineHeaderContent;

export type KVMSetHeaderContent = SetHeaderContent<KVMHeaderContent>;

export type SetSearchFilter = (searchFilter: string) => void;
