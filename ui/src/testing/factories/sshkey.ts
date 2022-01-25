import { define, extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { SSHKey, KeySource } from "app/store/sshkey/types";
import type { TimestampedModel } from "app/store/types/model";

export const keySource = define<KeySource>({
  auth_id: "test auth id",
  protocol: "test protocol",
});

export const sshKey = extend<TimestampedModel, SSHKey>(timestampedModel, {
  display: "display key",
  key: "test key",
  user: random,
});
