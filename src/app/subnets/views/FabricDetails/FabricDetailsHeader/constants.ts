import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const FabricDetailsViews = {
  DELETE_FABRIC: ["", "deleteFabric"],
} as const;

export type FabricDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof FabricDetailsViews>
>;
