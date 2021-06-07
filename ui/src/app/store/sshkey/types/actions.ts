import type { KeySource, SSHKey } from "./base";

export type CreateParams = {
  key: SSHKey["key"];
};

export type ImportParams = KeySource;
