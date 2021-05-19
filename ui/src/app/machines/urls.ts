import type { Machine } from "app/store/machine/types";
import type { ScriptResult } from "app/store/scriptresult/types";
import { argPath } from "app/utils";

const urls = {
  machines: {
    add: "/machines/add",
    index: "/machines",
    chassis: {
      add: "/machines/chassis/add",
    },
  },
  machine: {
    commissioning: {
      index: argPath<{ id: Machine["system_id"] }>(
        "/machine/:id/commissioning"
      ),
      scriptResult: argPath<{
        id: Machine["system_id"];
        scriptResultId: ScriptResult["id"];
      }>("/machine/:id/commissioning/:scriptResultId/details"),
    },
    configuration: argPath<{ id: Machine["system_id"] }>(
      "/machine/:id/configuration"
    ),
    events: argPath<{ id: Machine["system_id"] }>("/machine/:id/events"),
    index: argPath<{ id: Machine["system_id"] }>("/machine/:id"),
    instances: argPath<{ id: Machine["system_id"] }>("/machine/:id/instances"),
    logs: {
      events: argPath<{ id: Machine["system_id"] }>("/machine/:id/logs/events"),
      index: argPath<{ id: Machine["system_id"] }>("/machine/:id/logs"),
      installationOutput: argPath<{ id: Machine["system_id"] }>(
        "/machine/:id/logs/installation-output"
      ),
    },
    network: argPath<{ id: Machine["system_id"] }>("/machine/:id/network"),
    pciDevices: argPath<{ id: Machine["system_id"] }>(
      "/machine/:id/pci-devices"
    ),
    storage: argPath<{ id: Machine["system_id"] }>("/machine/:id/storage"),
    summary: argPath<{ id: Machine["system_id"] }>("/machine/:id/summary"),
    testing: {
      index: argPath<{ id: Machine["system_id"] }>("/machine/:id/testing"),
      scriptResult: argPath<{
        id: Machine["system_id"];
        scriptResultId: ScriptResult["id"];
      }>("/machine/:id/testing/:scriptResultId/details"),
    },
    usbDevices: argPath<{ id: Machine["system_id"] }>(
      "/machine/:id/usb-devices"
    ),
  },
};

export default urls;
