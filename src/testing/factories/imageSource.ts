import { define, random } from "cooky-cutter";

import type { BootSourceResponse } from "@/app/apiclient";

export const imageSource = define<BootSourceResponse>({
  id: (i: number) => i,
  url: "http://images.maas.io/ephemeral-v3/stable/",
  keyring_filename: "/usr/share/keyrings/ubuntu-cloudimage-keyring.gpg",
  keyring_data: "aabbccdd",
  priority: random,
  skip_keyring_verification: false,
});
