import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type {
  ControllerActionHeaderViews,
  ControllerNonActionHeaderViews,
  ControllerSidePanelViews,
} from "app/controllers/constants";

export type ControllerSidePanelContent = SidePanelContent<
  ValueOf<typeof ControllerSidePanelViews>
>;

export type ControllerActionSidePanelContent = SidePanelContent<
  ValueOf<typeof ControllerActionHeaderViews>
>;

export type ControllerNonActionSidePanelContent = SidePanelContent<
  ValueOf<typeof ControllerNonActionHeaderViews>
>;

export type ControllerSetSidePanelContent =
  SetSidePanelContent<ControllerSidePanelContent>;
