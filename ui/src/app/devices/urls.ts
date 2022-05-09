import type { Device, DeviceMeta } from "app/store/device/types";
import { argPath } from "app/utils";

const urls = {
  device: {
    configuration: argPath<{ id: Device[DeviceMeta.PK] }>(
      "/device/:id/configuration"
    ),
    index: argPath<{ id: Device[DeviceMeta.PK] }>("/device/:id"),
    network: argPath<{ id: Device[DeviceMeta.PK] }>("/device/:id/network"),
    summary: argPath<{ id: Device[DeviceMeta.PK] }>("/device/:id/summary"),
  },
  devices: {
    index: "/devices",
  },
};

export default urls;
