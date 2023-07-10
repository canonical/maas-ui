import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { DeviceSidePanelViews } from "app/devices/constants";

export type DeviceSidePanelContent = SidePanelContent<
  ValueOf<typeof DeviceSidePanelViews>
>;

export type DeviceSetSidePanelContent =
  SetSidePanelContent<DeviceSidePanelContent>;
