import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListRacksData,
  ListRacksError,
  ListRacksResponse,
  Options,
} from "@/app/apiclient";
import { listRacksOptions } from "@/app/apiclient/@tanstack/react-query.gen";

export const useRacks = (options?: Options<ListRacksData>) => {
  return useWebsocketAwareQuery(
    listRacksOptions(options) as UseQueryOptions<
      ListRacksData,
      ListRacksError,
      ListRacksResponse
    >
  );
};
