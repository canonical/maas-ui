import { extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { SSLKey } from "app/store/sslkey/types";
import type { TimestampedModel } from "app/store/types/model";

export const sslKey = extend<TimestampedModel, SSLKey>(timestampedModel, {
  display: "test key display",
  key: "test key",
  user: random,
});
