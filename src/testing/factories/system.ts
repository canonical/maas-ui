import { define } from "cooky-cutter";

import type { SystemInfoResponse } from "@/app/apiclient";

export const systemInfo = define<SystemInfoResponse>({
  fips_active: false,
  hardening_active: false,
  version: "3.7",
});
