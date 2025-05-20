import type { Dispatch, SetStateAction } from "react";

import type { ValueOf } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";

import type { ImageSidePanelViews } from "./constants";

import type { SetSidePanelContent, SidePanelContent } from "@/app/base/types";
import type {
  BootResource,
  BootResourceMeta,
} from "@/app/store/bootresource/types";
import type { UtcDatetime } from "@/app/store/types/model";

export type Image = {
  id: number;
  release: string;
  architecture: string;
  name: string;
  size: string;
  lastSynced: string | null;
  canDeployToMemory: boolean;
  status: string;
  lastDeployed: UtcDatetime;
  machines: number;
  resource: BootResource;
};

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
      {
        rowSelection?: RowSelectionState;
        setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
      }
    >
  | SidePanelContent<
      ValueOf<typeof ImageSidePanelViews>,
      { bootResource?: BootResource }
    >;

export type ImageSetSidePanelContent =
  SetSidePanelContent<ImageSidePanelContent>;
