import type { TagSidePanelViews } from "./constants";

import type { SidePanelContent, SetSidePanelContent } from "@/app/base/types";
import type { Tag, TagMeta } from "@/app/store/tag/types";

type HeaderViews = typeof TagSidePanelViews;

export type TagSidePanelContent =
  | SidePanelContent<
      HeaderViews["DeleteTag"],
      { id: Tag[TagMeta.PK]; fromDetails?: boolean }
    >
  | SidePanelContent<HeaderViews["AddTag"]>
  | SidePanelContent<HeaderViews["UpdateTag"], { id: Tag[TagMeta.PK] }>;

export type TagSetSidePanelContent = SetSidePanelContent<TagSidePanelContent>;
