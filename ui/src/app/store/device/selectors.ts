import type { Device, DeviceState } from "app/store/device/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (device: Device, term: string) =>
  device.fqdn.includes(term);

const selectors = generateBaseSelectors<DeviceState, Device, "system_id">(
  "device",
  "system_id",
  searchFunction
);

export default selectors;
