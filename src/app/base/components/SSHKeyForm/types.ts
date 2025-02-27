import type { SshKeyResponse } from "@/app/apiclient";

export type SSHKeyFormValues = {
  protocol: SshKeyResponse["protocol"];
  auth_id: SshKeyResponse["auth_id"];
  key: SshKeyResponse["key"];
};
