import { define } from "cooky-cutter";

import type { PowerTypeField, PowerTypeResponse } from "@/app/apiclient";
import { PowerFieldType } from "@/app/store/general/types";

export const powerFieldV3 = define<PowerTypeField>({
  choices: () => [],
  default: "auto",
  field_type: PowerFieldType.STRING,
  label: (i: number) => `test-powerfield-label-${i}`,
  name: (i: number) => `test-powerfield-name-${i}`,
  required: false,
});

export const powerTypeV3 = define<PowerTypeResponse>({
  driver_type: "power",
  name: "amt",
  description: "Intel AMT",
  fields: () => [powerFieldV3()],
  chassis: false,
  can_probe: false,
  missing_packages: () => [],
  queryable: true,
  fips_supported: true,
  fips_unsupported_reason: undefined,
});
