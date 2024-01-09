import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent, SetSidePanelContent } from "app/base/types";
import type { DeviceSidePanelViews } from "app/devices/constants";
import type { NetworkInterface, NetworkLink } from "app/store/types/node";

export type DeviceSidePanelContent = SidePanelContent<
  ValueOf<typeof DeviceSidePanelViews>,
  {
    linkId?: NetworkLink["id"];
    nicId?: NetworkInterface["id"];
  }
>;

export type DeviceSetSidePanelContent =
  SetSidePanelContent<DeviceSidePanelContent>;
