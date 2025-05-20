import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const PoolActionSidePanelViews = {
  CREATE_POOL: ["poolForm", "createPool"],
  EDIT_POOL: ["poolForm", "editPool"],
  DELETE_POOL: ["poolForm", "deletePool"],
} as const;

export type PoolSidePanelContent = SidePanelContent<
  ValueOf<typeof PoolActionSidePanelViews>,
  { poolId: number }
>;
