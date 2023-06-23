import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const SpaceDetailsViews = {
  DELETE_SPACE: ["", "deleteSpace"],
} as const;

export type SpaceDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof SpaceDetailsViews>
>;
