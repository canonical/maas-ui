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

const getTagsFromIds = (
  tags: Tag[],
  tagIDs: Tag[TagMeta.PK][] | null
): Tag[] => {
  if (!tagIDs) {
    return [];
  }
  return tagIDs.reduce<Tag[]>((filteredTags, tagID) => {
    const tag = tags.find((tag) => tag.id === tagID);
    if (tag) {
      filteredTags.push(tag);
    }
    return filteredTags;
  }, []);
};

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
  (allTags, tagIDs) => getTagsFromIds(allTags, tagIDs)
);

/**
 * Get a list of manual tags.
 * @param state - The redux state.
 * @returns A list of manual tags.
 */
const getManual = createSelector([defaultSelectors.all], (tags) =>
  tags.filter(({ definition }) => !definition)
);

/**
 * Get a list of automatic tags.
 * @param state - The redux state.
 * @returns A list of automatic tags.
 */
const getAutomatic = createSelector([defaultSelectors.all], (tags) =>
  // Automatic tags have a definition.
  tags.filter(({ definition }) => !!definition)
);

/**
 * Get a list of tags from a list of their IDs.
 * @param state - The redux state.
 * @param ids - A list of tag IDs.
 * @returns A list of tags.
 */
const getAutomaticByIDs = createSelector(
  [
    getAutomatic,
    (_state: RootState, tagIDs: Tag[TagMeta.PK][] | null) => tagIDs,
  ],
  (automaticTags, tagIDs) => getTagsFromIds(automaticTags, tagIDs)
);

/**
 * Get a list of tags from a list of their IDs.
 * @param state - The redux state.
 * @param ids - A list of tag IDs.
 * @returns A list of tags.
 */
const getManualByIDs = createSelector(
  [getManual, (_state: RootState, tagIDs: Tag[TagMeta.PK][] | null) => tagIDs],
  (manualTags, tagIDs) => getTagsFromIds(manualTags, tagIDs)
);

/**
 * Get a tag by its name.
 * @param state - The redux state.
 * @param name - The tag's name.
 * @returns A tag.
 */
const getByName = createSelector(
  [defaultSelectors.all, (_state: RootState, name: Tag["name"] | null) => name],
  (tags, name) => {
    if (!name) {
      return null;
    }
    return tags.find((tag) => tag.name === name) ?? null;
  }
);

export enum TagSearchFilter {
  All = "all",
  Manual = "manual",
  Auto = "auto",
}

/**
 * Get machines that match search terms and filters.
 * @param state - The redux state.
 * @param terms - The terms to match against.
 * @param filter - A .
 * @returns A filtered list of machines.
 */
const search = createSelector(
  [
    defaultSelectors.all,
    (
      _state: RootState,
      terms: string | null | undefined,
      filter: TagSearchFilter | null | undefined
    ) => ({
      filter,
      terms,
    }),
  ],
  (tags: Tag[], { terms, filter }) => {
    if (filter && filter !== TagSearchFilter.All) {
      tags = tags.filter(({ definition }) =>
        filter === TagSearchFilter.Auto ? !!definition : !definition
      );
    }
    if (terms) {
      tags = tags.filter((tag) => searchFunction(tag, terms));
    }
    return tags;
  }
);

const selectors = {
  ...defaultSelectors,
  getAutomatic,
  getAutomaticByIDs,
  getByIDs,
  getByName,
  getManual,
  getManualByIDs,
  search,
};

export default selectors;
