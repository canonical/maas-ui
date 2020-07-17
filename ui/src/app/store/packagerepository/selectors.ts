import { generateBaseSelectors } from "app/store/utils";
import type {
  PackageRepository,
  PackageRepositoryState,
} from "app/store/packagerepository/types";

const searchFunction = (repo: PackageRepository, term: string) =>
  repo.name.includes(term) || repo.url.includes(term);

const selectors = generateBaseSelectors<PackageRepositoryState, "id">(
  "packagerepository",
  "id",
  searchFunction
);

export default selectors;
