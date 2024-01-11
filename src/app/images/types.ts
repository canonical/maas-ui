import type { ValueOf } from "@canonical/react-components";

import type { ImageSidePanelViews } from "./constants";

import type { SetSidePanelContent, SidePanelContent } from "app/base/types";
import type {
  BootResource,
  BootResourceMeta,
} from "@/app/store/bootresource/types";

export type ImageValue = {
  arch: string;
  os: string;
  release: string;
  resourceId?: BootResource[BootResourceMeta.PK];
  subArch?: string;
  title: string;
};

export type ImageSidePanelContent =
  | SidePanelContent<
      ValueOf<typeof ImageSidePanelViews>,
      { hasSources?: boolean }
    >
  | SidePanelContent<
      ValueOf<typeof ImageSidePanelViews>,
      { bootResource?: BootResource }
    >;

export type ImageSetSidePanelContent =
  SetSidePanelContent<ImageSidePanelContent>;
