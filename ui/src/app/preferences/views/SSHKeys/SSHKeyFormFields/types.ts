import type { KeySource, SSHKey } from "app/store/sshkey/types";

export type SSHKeyFormValues = {
  protocol: KeySource["protocol"];
  auth_id: KeySource["auth_id"];
  key: SSHKey["key"];
};
