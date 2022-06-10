import type { Controller, ControllerMeta } from "app/store/controller/types";
import type {
  ScriptResult,
  ScriptResultMeta,
} from "app/store/scriptresult/types";
import { argPath } from "app/utils";

const urls = {
  controllers: {
    index: "/controllers",
  },
  controller: {
    commissioning: {
      index: argPath<{ id: Controller[ControllerMeta.PK] }>(
        "/controller/:id/commissioning"
      ),
      scriptResult: argPath<{
        id: Controller[ControllerMeta.PK];
        scriptResultId: ScriptResult[ScriptResultMeta.PK];
      }>("/controller/:id/commissioning/:scriptResultId/details"),
    },
    configuration: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/configuration"
    ),
    index: argPath<{ id: Controller[ControllerMeta.PK] }>("/controller/:id"),
    logs: {
      events: argPath<{ id: Controller[ControllerMeta.PK] }>(
        "/controller/:id/logs/events"
      ),
      index: argPath<{ id: Controller[ControllerMeta.PK] }>(
        "/controller/:id/logs"
      ),
      installationOutput: argPath<{ id: Controller[ControllerMeta.PK] }>(
        "/controller/:id/logs/installation-output"
      ),
    },
    network: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/network"
    ),
    pciDevices: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/pci-devices"
    ),
    storage: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/storage"
    ),
    summary: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/summary"
    ),
    usbDevices: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/usb-devices"
    ),
    vlans: argPath<{ id: Controller[ControllerMeta.PK] }>(
      "/controller/:id/vlans"
    ),
  },
} as const;

export default urls;
