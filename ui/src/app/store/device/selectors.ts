import { DeviceMeta } from "app/store/device/types";
import type { Device, DeviceState } from "app/store/device/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (device: Device, term: string) =>
  device.fqdn.includes(term);

const selectors = generateBaseSelectors<DeviceState, Device, DeviceMeta.PK>(
  DeviceMeta.MODEL,
  DeviceMeta.PK,
  searchFunction
);

export default selectors;
