import { define } from "cooky-cutter";

import type { Config, ConfigValues } from "app/store/config/types";

export const config = define<Config<ConfigValues>>({
  name: "test name",
  value: null,
});
