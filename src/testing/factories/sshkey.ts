import { define, extend, random } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { SshKeyResponse } from "@/app/apiclient";
import type { SSHKey, KeySource } from "@/app/store/sshkey/types";
import type { TimestampedModel } from "@/app/store/types/model";

export const keySource = define<KeySource>({
  auth_id: "test auth id",
  protocol: "test protocol",
});

export const sshKey = extend<TimestampedModel, SSHKey>(timestampedModel, {
  display: (i: number) => `display key ${i}`,
  key: "test key",
  user: random,
});

export const sshKeyV3 = define<SshKeyResponse>({
  id: random,
  key: "test key",
  protocol: "gh",
  auth_id: "test auth id",
  kind: "sshkey",
});
