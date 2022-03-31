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
  const selectedTags = useSelector((state: RootState) =>
    tagSelectors.getByIDs(
      state,
      values.tags.reduce<Tag[TagMeta.PK][]>((tagList, id) => {
        const idNumber = toFormikNumber(id);
        if (idNumber) {
          tagList.push(idNumber);
        }
        return tagList;
      }, [])
    )
  );
  return selectedTags;
};
