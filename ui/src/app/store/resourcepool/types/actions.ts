import type { ResourcePool } from "./base";
import type { ResourcePoolMeta } from "./enum";

export type CreateParams = {
  name: ResourcePool["name"];
  description: ResourcePool["description"];
};

export type UpdateParams = CreateParams & {
  [ResourcePoolMeta.PK]: ResourcePool[ResourcePoolMeta.PK];
};
