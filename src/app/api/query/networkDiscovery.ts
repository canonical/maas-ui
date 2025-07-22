import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import type {
  ClearAllDiscoveriesWithOptionalIpAndMacData,
  ClearAllDiscoveriesWithOptionalIpAndMacError,
  ClearAllDiscoveriesWithOptionalIpAndMacResponse,
  ListDiscoveriesData,
  ListDiscoveriesError,
  ListDiscoveriesResponse,
  Options,
} from "@/app/apiclient";
import { clearAllDiscoveriesWithOptionalIpAndMac } from "@/app/apiclient";
import {
  listDiscoveriesOptions,
  listDiscoveriesQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

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

export const useClearNetworkDiscoveries = (
  mutationOptions?: Options<ClearAllDiscoveriesWithOptionalIpAndMacData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ClearAllDiscoveriesWithOptionalIpAndMacResponse,
    ClearAllDiscoveriesWithOptionalIpAndMacError,
    Options<ClearAllDiscoveriesWithOptionalIpAndMacData>
  >({
    // TODO: Replace with the mutation once available
    ...clearAllDiscoveriesWithOptionalIpAndMac(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listDiscoveriesQueryKey(),
      });
    },
  });
};
