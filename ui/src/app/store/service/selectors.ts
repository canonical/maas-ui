import { generateBaseSelectors } from "app/store/utils";
import type { Service, ServiceState } from "app/store/service/types";

const searchFunction = (service: Service, term: string) =>
  service.name.includes(term);

const selectors = generateBaseSelectors<ServiceState, "id">(
  "service",
  "id",
  searchFunction
);

export default selectors;
