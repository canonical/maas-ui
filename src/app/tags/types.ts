import type { TagHeaderViews } from "./constants";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { Tag, TagMeta } from "app/store/tag/types";

type HeaderViews = typeof TagHeaderViews;

export type TagHeaderContent =
  | HeaderContent<HeaderViews["AddTag"]>
  | HeaderContent<
      HeaderViews["DeleteTag"],
      { id: Tag[TagMeta.PK]; fromDetails?: boolean }
    >;

export type TagSetHeaderContent = SetHeaderContent<TagHeaderContent>;

export enum TagViewState {
  Creating = "creating",
  Deleting = "deleting",
  Updating = "updating",
}
