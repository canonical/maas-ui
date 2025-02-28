import { define, random } from "cooky-cutter";

import type { ZoneWithSummaryResponse } from "@/app/apiclient";

export const zone = define<ZoneWithSummaryResponse>({
  controllers_count: random,
  description: "test description",
  devices_count: random,
  machines_count: random,
  name: (i: number) => `zone-${i}`,
  id: (i: number) => i,
});
