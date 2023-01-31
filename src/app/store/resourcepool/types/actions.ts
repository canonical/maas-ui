import type { ResourcePool } from "./base";
import type { ResourcePoolMeta } from "./enum";

import type {
  FetchFilters,
  Machine,
  MachineMeta,
} from "app/store/machine/types";

export type CreateParams = {
  description: ResourcePool["description"];
  name: ResourcePool["name"];
};

type CreateWithFilterParams = {
  pool: CreateParams;
  filter: FetchFilters;
};

type CreateWithMachineIdsParams = {
  pool: CreateParams;
  machineIDs: Machine[MachineMeta.PK][];
};

export type CreateWithMachinesParams =
  | CreateWithMachineIdsParams
  | CreateWithFilterParams;

export type UpdateParams = CreateParams & {
  [ResourcePoolMeta.PK]: ResourcePool[ResourcePoolMeta.PK];
};
