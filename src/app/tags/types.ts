import type { TagSidePanelViews } from "./constants";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { Tag, TagMeta } from "app/store/tag/types";

type HeaderViews = typeof TagSidePanelViews;

export type TagSidePanelContent =
  | SidePanelContent<HeaderViews["AddTag"]>
  | SidePanelContent<
      HeaderViews["DeleteTag"],
      { id: Tag[TagMeta.PK]; fromDetails?: boolean }
    >;

export type TagSetSidePanelContent = SetSidePanelContent<TagSidePanelContent>;

export enum TagViewState {
  Creating = "creating",
  Deleting = "deleting",
  Updating = "updating",
}
