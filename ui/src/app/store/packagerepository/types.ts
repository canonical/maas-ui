import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type PackageRepository = Model & {
  arches: string[];
  components: string[];
  created: string;
  default: boolean;
  disable_sources: boolean;
  disabled_components: string[];
  disabled_pockets: string[];
  distributions: string[];
  enabled: boolean;
  key: string;
  name: string;
  updated: string;
  url: string;
};

export type PackageRepositoryState = {
  errors: TSFixMe;
  items: PackageRepository[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
