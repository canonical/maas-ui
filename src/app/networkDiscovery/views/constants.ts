import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const DiscoverySidePanelViews = {
  CLEAR_ALL_DISCOVERIES: ["", "clearAllDiscoveries"],
} as const;

export type DiscoverySidePanelContent = SidePanelContent<
  ValueOf<typeof DiscoverySidePanelViews>
>;
