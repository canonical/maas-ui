import { define, extend, random } from "cooky-cutter";

import { model } from "./model";

import type { SSHKey, KeySource } from "app/store/sshkey/types";
import type { Model } from "app/store/types/model";

export const keySource = define<KeySource>({
  auth_id: "test auth id",
  protocol: "test protocol",
});

export const sshKey = extend<Model, SSHKey>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  display: "display key",
  key: "test key",
  keysource: keySource,
  updated: "Wed, 08 Jul. 2020 05:35:4",
  user: random,
});
