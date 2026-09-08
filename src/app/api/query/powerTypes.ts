import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListPowerTypesData,
  ListPowerTypesError,
  ListPowerTypesResponse,
  Options,
} from "@/app/apiclient";
import { listPowerTypesOptions } from "@/app/apiclient/@tanstack/react-query.gen";

export const usePowerTypes = (options?: Options<ListPowerTypesData>) => {
  return useWebsocketAwareQuery(
    listPowerTypesOptions(options) as UseQueryOptions<
      ListPowerTypesData,
      ListPowerTypesError,
      ListPowerTypesResponse
    >
  );
};
