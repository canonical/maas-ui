import type { Tag, TagMeta } from "app/store/tag/types";

export const getTagsDisplay = (tags: Tag[]): string => {
  if (tags.length === 0) {
    return "-";
  }
  return tags
    .map((tag) => tag.name)
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
};

export const getTagNamesForIds = (
  ids: Tag[TagMeta.PK][],
  tags: Tag[]
): Tag["name"][] =>
  ids.reduce<Tag["name"][]>((tagNames, tagId) => {
    const tag = tags.find(({ id }) => id === tagId);
    if (tag) {
      tagNames.push(tag.name);
    }
    return tagNames;
  }, []);
