import type { PackageRepository } from "./types";

/**
 * Map repositories to names.
 * @param repo - A repository
 * @return The mapped name.
 */
export const getRepoDisplayName = (repo: PackageRepository): string => {
  if (repo.default && repo.name === "main_archive") {
    return "Ubuntu archive";
  } else if (repo.default && repo.name === "ports_archive") {
    return "Ubuntu extra architectures";
  }
  return repo.name;
};
