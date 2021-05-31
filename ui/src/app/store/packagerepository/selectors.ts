import { getRepoDisplayName } from "./utils";

import { PackageRepositoryMeta } from "app/store/packagerepository/types";
import type {
  PackageRepository,
  PackageRepositoryState,
} from "app/store/packagerepository/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (repo: PackageRepository, term: string) =>
  getRepoDisplayName(repo).includes(term) ||
  repo.name.includes(term) ||
  repo.url.includes(term);

const selectors = generateBaseSelectors<
  PackageRepositoryState,
  PackageRepository,
  PackageRepositoryMeta.PK
>(PackageRepositoryMeta.MODEL, PackageRepositoryMeta.PK, searchFunction);

export default selectors;
