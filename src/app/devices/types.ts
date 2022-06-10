import type { ValueOf } from "@canonical/react-components";

import type { HeaderContent, SetHeaderContent } from "app/base/types";
import type { DeviceHeaderViews } from "app/devices/constants";

export type DeviceHeaderContent = HeaderContent<
  ValueOf<typeof DeviceHeaderViews>
>;

export type DeviceSetHeaderContent = SetHeaderContent<DeviceHeaderContent>;
