import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { TagFormValues } from "./types";

import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type { Tag, TagMeta } from "app/store/tag/types";
import { toFormikNumber } from "app/utils";

/**
 * Get the tag objects for the tag ids that have been selected in the form.
 */
export const useSelectedTags = (key: keyof TagFormValues): Tag[] => {
  const { values } = useFormikContext<TagFormValues>();
  // The Formik values are strings so we need to convert these into numbers so
  // they can be used in the selector.
  const tagIds = values[key].reduce<Tag[TagMeta.PK][]>((tagList, id) => {
    const idNumber = toFormikNumber(id);
    if (idNumber) {
      tagList.push(idNumber);
    }
    return tagList;
  }, []);
  const selectedTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(state, tagIds)
  );
  return selectedTags;
};

/**
 * Filter tags for those that have not been added or removed.
 * @param tags A list of tags to filter.
 * @returns A list of unchanged tags.
 */
export const useUnchangedTags = (tags: Tag[]): Tag[] => {
  const { values } = useFormikContext<TagFormValues>();
  // Use `find` instead of `includes` as we need to convert the stored values
  // to numbers (Formik returns either strings or numbers depending on the
  // render cycle).
  return tags.filter(
    (tag) =>
      !values.added.find((tagId) => toFormikNumber(tagId) === tag.id) &&
      !values.removed.find((tagId) => toFormikNumber(tagId) === tag.id)
  );
};
