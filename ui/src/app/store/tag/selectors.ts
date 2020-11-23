import { generateBaseSelectors } from "app/store/utils";

import type { Tag, TagState } from "app/store/tag/types";

const searchFunction = (tag: Tag, term: string) => tag.name.includes(term);

const selectors = generateBaseSelectors<TagState, Tag, "id">(
  "tag",
  "id",
  searchFunction
);

export default selectors;
