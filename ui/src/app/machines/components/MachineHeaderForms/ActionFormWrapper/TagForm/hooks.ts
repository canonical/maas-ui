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
export const useSelectedTags = (): Tag[] => {
  const { values } = useFormikContext<TagFormValues>();
  // The Formik values are strings so we need to convert these into numbers so
  // they can be used in the selector.
  const tagIds = values.tags.reduce<Tag[TagMeta.PK][]>((tagList, id) => {
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
