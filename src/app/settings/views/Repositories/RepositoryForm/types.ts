import type { PackageRepository } from "app/store/packagerepository/types";

export type RepositoryFormValues = {
  arches: PackageRepository["arches"];
  components: string;
  default: PackageRepository["default"];
  disable_sources: PackageRepository["disable_sources"];
  disabled_components: PackageRepository["disabled_components"];
  disabled_pockets: PackageRepository["disabled_pockets"];
  distributions: string;
  enabled: PackageRepository["enabled"];
  key: PackageRepository["key"];
  name: PackageRepository["name"];
  url: PackageRepository["url"];
};
