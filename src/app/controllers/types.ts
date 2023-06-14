import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { ControllerSidePanelViews } from "app/controllers/constants";

export type ControllerSidePanelContent = SidePanelContent<
  ValueOf<typeof ControllerSidePanelViews>
>;

export type ControllerSetSidePanelContent =
  SetSidePanelContent<ControllerSidePanelContent>;
