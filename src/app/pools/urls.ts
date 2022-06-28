import type { ResourcePool } from "app/store/resourcepool/types";
import { argPath } from "app/utils";

const urls = {
  add: "/pools/add",
  edit: argPath<{ id: ResourcePool["id"] }>("/pools/:id/edit"),
  index: "/pools",
};

export default urls;
