import type { Space, SpaceState } from "app/store/space/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (space: Space, term: string) =>
  space.name.includes(term);

const selectors = generateBaseSelectors<SpaceState, Space, "id">(
  "space",
  "id",
  searchFunction
);

export default selectors;
