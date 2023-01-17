import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { ControllerHeaderViews } from "app/controllers/constants";

export type ControllerSidePanelContent = SidePanelContent<
  ValueOf<typeof ControllerHeaderViews>
>;

export type ControllerSetSidePanelContent =
  SetSidePanelContent<ControllerSidePanelContent>;
