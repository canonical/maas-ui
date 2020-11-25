import { getRepoDisplayName } from "./utils";

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
  "id"
>("packagerepository", "id", searchFunction);

export default selectors;
