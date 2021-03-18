import { extend } from "cooky-cutter";

import { model } from "./model";

import type { EventRecord } from "app/store/event/types";
import type { Model } from "app/store/types/model";

export const eventRecord = extend<Model, EventRecord>(model, {
  action: "action-h7Jza3",
  created: "Tue, 16 Mar. 2021 03:04:00",
  description: "desc-LRv9EV",
  endpoint: 1,
  ip_address: "152.26.96.176",
  node_hostname: "honest-bear",
  node_id: 11,
  node_system_id: "tftrtd",
  type: () => ({
    description: "description-2HCo4f",
    level: "info",
    name: "name-9pJmiYbyjNLfuAeVkxlc",
  }),
  updated: "Tue, 16 Mar. 2021 03:04:00",
  user_agent: "user_agent-HY93gV",
  user_id: 572,
  username: "RYKeTLTLIp",
});
