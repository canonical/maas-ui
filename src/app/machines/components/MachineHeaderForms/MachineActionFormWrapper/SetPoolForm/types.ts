import type { ResourcePool } from "app/store/resourcepool/types";

export type SetPoolFormValues = {
  description: ResourcePool["description"];
  name: ResourcePool["name"];
  poolSelection: "create" | "select";
};
