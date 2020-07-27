import { define } from "cooky-cutter";

import type { Config } from "app/store/config/types";

export const config = define<Config>({
  name: "test name",
  value: null,
});
