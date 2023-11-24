import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const NetworkDiscoverySidePanelViews = {
  CLEAR_ALL_DISCOVERIES: ["", "clearAllDiscoveries"],
} as const;

export type NetworkDiscoverySidePanelContent = SidePanelContent<
  ValueOf<typeof NetworkDiscoverySidePanelViews>
>;
