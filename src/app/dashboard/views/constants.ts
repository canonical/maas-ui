import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const DashboardSidePanelViews = {
  CLEAR_ALL_DISCOVERIES: ["", "clearAllDiscoveries"],
} as const;

export type DashboardSidePanelContent = SidePanelContent<
  ValueOf<typeof DashboardSidePanelViews>
>;
