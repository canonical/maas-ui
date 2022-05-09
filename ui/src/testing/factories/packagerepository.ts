import { extend } from "cooky-cutter";

import { timestampedModel } from "./model";

import type { PackageRepository } from "app/store/packagerepository/types";
import type { TimestampedModel } from "app/store/types/model";

export const packageRepository = extend<TimestampedModel, PackageRepository>(
  timestampedModel,
  {
    arches: () => [],
    components: () => [],
    default: false,
    disable_sources: false,
    disabled_components: () => [],
    disabled_pockets: () => [],
    distributions: () => [],
    enabled: false,
    key: "",
    name: "test repo",
    url: "test url",
  }
);
