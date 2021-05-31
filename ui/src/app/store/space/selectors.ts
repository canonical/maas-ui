import { SpaceMeta } from "app/store/space/types";
import type { Space, SpaceState } from "app/store/space/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (space: Space, term: string) =>
  space.name.includes(term);

const selectors = generateBaseSelectors<SpaceState, Space, SpaceMeta.PK>(
  SpaceMeta.MODEL,
  SpaceMeta.PK,
  searchFunction
);

export default selectors;
