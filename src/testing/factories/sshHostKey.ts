import { define, random } from "cooky-cutter";

import type { SshHostKeyResponse } from "@/app/apiclient";

export const sshHostKey = define<SshHostKeyResponse>({
  id: random,
  host: "test-host",
  key_type: "ssh-ed25519",
  public_key: "AAAAC3NzaC1lZDI1NTE5AAAAIKV6QaqOcp8OMe9tw0i3aB7z test-key",
  label: "test label",
  created: "2024-01-01T00:00:00",
  updated: "2024-01-01T00:00:00",
});
