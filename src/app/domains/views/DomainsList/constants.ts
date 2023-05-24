import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "app/base/types";

export const DomainListSidePanelViews = {
  ADD_DOMAIN: ["", "addDomain"],
} as const;

export type DomainListSidePanelContent = SidePanelContent<
  ValueOf<typeof DomainListSidePanelViews>
>;
