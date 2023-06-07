import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const DomainDetailsSidePanelViews = {
  ADD_RECORD: ["", "addRecord"],
  DELETE_DOMAIN: ["", "deleteDomain"],
} as const;

export type DomainDetailsSidePanelContent = SidePanelContent<
  ValueOf<typeof DomainDetailsSidePanelViews>
>;
