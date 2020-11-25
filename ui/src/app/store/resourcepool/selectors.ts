import type {
  ResourcePool,
  ResourcePoolState,
} from "app/store/resourcepool/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (resourcepool: ResourcePool, term: string) =>
  resourcepool.name.includes(term);

const selectors = generateBaseSelectors<ResourcePoolState, ResourcePool, "id">(
  "resourcepool",
  "id",
  searchFunction
);

export default selectors;
