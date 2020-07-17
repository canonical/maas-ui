import { generateBaseSelectors } from "app/store/utils";
import type {
  ResourcePool,
  ResourcePoolState,
} from "app/store/resourcepool/types";

const searchFunction = (resourcepool: ResourcePool, term: string) =>
  resourcepool.name.includes(term);

const selectors = generateBaseSelectors<ResourcePoolState, "id">(
  "resourcepool",
  "id",
  searchFunction
);

export default selectors;
