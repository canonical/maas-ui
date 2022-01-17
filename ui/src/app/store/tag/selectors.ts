import { createSelector } from "reselect";

import type { RootState } from "app/store/root/types";
import { TagMeta } from "app/store/tag/types";
import type { Tag, TagState } from "app/store/tag/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (tag: Tag, term: string) => tag.name.includes(term);

const defaultSelectors = generateBaseSelectors<TagState, Tag, TagMeta.PK>(
  TagMeta.MODEL,
  TagMeta.PK,
  searchFunction
);

/**
 * Get a list of tags from a list of their IDs.
 * @param state - The redux state.
 * @param ids - A list of tag IDs.
 * @returns A list of tags.
 */
const getByIDs = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, tagIDs: Tag[TagMeta.PK][] | null) => tagIDs,
  ],
  (allTags, tagIDs) => {
    if (!tagIDs) {
      return [];
    }
    return tagIDs.reduce<Tag[]>((tags, tagID) => {
      const tag = allTags.find((tag) => tag.id === tagID);
      if (tag) {
        tags.push(tag);
      }
      return tags;
    }, []);
  }
);

const selectors = {
  ...defaultSelectors,
  getByIDs,
};

export default selectors;
