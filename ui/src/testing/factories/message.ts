import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { Message } from "app/store/message/types";

export const message = extend<Model, Message>(model, {
  message: "Test message",
  temporary: true,
  type: "caution",
});
