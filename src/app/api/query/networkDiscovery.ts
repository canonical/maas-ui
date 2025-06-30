import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  ListDiscoveriesData,
  ListDiscoveriesError,
  ListDiscoveriesResponse,
  Options,
} from "@/app/apiclient";
import { listDiscoveriesOptions } from "@/app/apiclient/@tanstack/react-query.gen";

export const useNetworkDiscoveries = (
  options?: Options<ListDiscoveriesData>
) => {
  return useWebsocketAwareQuery(
    listDiscoveriesOptions(options) as UseQueryOptions<
      ListDiscoveriesData,
      ListDiscoveriesError,
      ListDiscoveriesResponse
    >
  );
};
