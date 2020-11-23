import { extend } from "cooky-cutter";

import { model } from "./model";

import type { Model } from "app/store/types/model";

import type { PackageRepository } from "app/store/packagerepository/types";

export const packageRepository = extend<Model, PackageRepository>(model, {
  created: "Wed, 08 Jul. 2020 05:35:4",
  updated: "Wed, 08 Jul. 2020 05:35:4",
  name: "test repo",
  url: "test url",
  distributions: () => [],
  disabled_pockets: () => [],
  disabled_components: () => [],
  disable_sources: false,
  components: () => [],
  arches: () => [],
  key: "",
  default: false,
  enabled: false,
});
