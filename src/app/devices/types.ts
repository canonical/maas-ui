import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { DeviceHeaderViews } from "app/devices/constants";

export type DeviceSidePanelContent = SidePanelContent<
  ValueOf<typeof DeviceHeaderViews>
>;

export type DeviceSetSidePanelContent =
  SetSidePanelContent<DeviceSidePanelContent>;
