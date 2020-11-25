import type { Domain, DomainState } from "app/store/domain/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (domain: Domain, term: string) =>
  domain.name.includes(term);

const selectors = generateBaseSelectors<DomainState, Domain, "id">(
  "domain",
  "id",
  searchFunction
);

export default selectors;
