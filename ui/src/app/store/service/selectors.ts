import type { Service, ServiceState } from "app/store/service/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (service: Service, term: string) =>
  service.name.includes(term);

const selectors = generateBaseSelectors<ServiceState, Service, "id">(
  "service",
  "id",
  searchFunction
);

export default selectors;
