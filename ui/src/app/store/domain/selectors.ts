import { generateBaseSelectors } from "app/store/utils";
import type { Domain, DomainState } from "app/store/domain/types";

const searchFunction = (domain: Domain, term: string) =>
  domain.name.includes(term);

const selectors = generateBaseSelectors<DomainState, "id">(
  "domain",
  "id",
  searchFunction
);

export default selectors;
