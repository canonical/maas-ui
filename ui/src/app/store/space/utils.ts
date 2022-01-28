import type { Space } from "./types";

export const getSpaceDisplay = (space?: Space | null): string =>
  space?.name || "No space";

export const getSpaceById = (
  spaces: Space[],
  spaceId: Space["id"] | null
): Space | undefined => {
  return spaces.find((space) => space?.id === spaceId);
};

export const getCanBeDeleted = (space?: Space | null): boolean =>
  space?.subnet_ids.length === 0;
