import type { ValueOf } from "@canonical/react-components";

import type { DiscoveryResponse } from "@/app/apiclient";
import type { SidePanelContent } from "@/app/base/types";

export const NetworkDiscoverySidePanelViews = {
  ADD_DISCOVERY: ["", "addDiscovery"],
  CLEAR_ALL_DISCOVERIES: ["", "clearAllDiscoveries"],
  DELETE_DISCOVERY: ["", "deleteDiscovery"],
} as const;

export type NetworkDiscoverySidePanelContent = SidePanelContent<
  ValueOf<typeof NetworkDiscoverySidePanelViews>,
  { discovery?: DiscoveryResponse }
>;
