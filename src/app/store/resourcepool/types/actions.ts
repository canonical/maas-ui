import type { ResourcePool } from "./base";
import type { ResourcePoolMeta } from "./enum";

import type { Machine, MachineMeta } from "app/store/machine/types";

export type CreateParams = {
  description: ResourcePool["description"];
  name: ResourcePool["name"];
};

export type CreateWithMachinesParams = {
  machineIDs: Machine[MachineMeta.PK][];
  pool: CreateParams;
};

export type UpdateParams = CreateParams & {
  [ResourcePoolMeta.PK]: ResourcePool[ResourcePoolMeta.PK];
};
