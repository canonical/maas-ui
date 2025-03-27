import type { SshKeyResponse } from "@/app/apiclient";

export type SSHKeyFormValues = {
  protocol: SshKeyResponse["protocol"] | "upload" | "";
  auth_id: SshKeyResponse["auth_id"];
  key: SshKeyResponse["key"];
};
