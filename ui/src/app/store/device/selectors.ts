import { generateBaseSelectors } from "app/store/utils";
import type { Device, DeviceState } from "app/store/device/types";

const searchFunction = (device: Device, term: string) =>
  device.fqdn.includes(term);

const selectors = generateBaseSelectors<DeviceState, "system_id">(
  "device",
  "system_id",
  searchFunction
);

export default selectors;
