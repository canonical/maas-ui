import type { Tag } from "app/store/tag/types";

export const getTagsDisplay = (tags: Tag[]): string => {
  if (tags.length === 0) {
    return "-";
  }
  return tags
    .map((tag) => tag.name)
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
};
