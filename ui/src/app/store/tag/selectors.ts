import { TagMeta } from "app/store/tag/types";
import type { Tag, TagState } from "app/store/tag/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (tag: Tag, term: string) => tag.name.includes(term);

const selectors = generateBaseSelectors<TagState, Tag, TagMeta.PK>(
  TagMeta.MODEL,
  TagMeta.PK,
  searchFunction
);

export default selectors;
