import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  GetConfigurationData,
  GetConfigurationError,
  GetConfigurationResponse,
  GetConfigurationsData,
  GetConfigurationsResponse,
  SetConfigurationData,
  SetConfigurationError,
  SetConfigurationResponse,
  SetConfigurationsData,
  SetConfigurationsError,
  SetConfigurationsResponse,
} from "@/app/apiclient";
import {
  getConfigurationOptions,
  getConfigurationsOptions,
  getConfigurationsQueryKey,
  setConfigurationMutation,
  setConfigurationsMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";
import type { Options } from "@/app/apiclient/client";

export const useConfigurations = (options?: Options<GetConfigurationsData>) => {
  return useWebsocketAwareQuery(
    getConfigurationsOptions(options) as UseQueryOptions<
      GetConfigurationsData,
      GetConfigurationError,
      GetConfigurationsResponse
    >
  );
};

export const useGetConfiguration = (options: Options<GetConfigurationData>) => {
  return useWebsocketAwareQuery(
    getConfigurationOptions(options) as UseQueryOptions<
      GetConfigurationData,
      GetConfigurationError,
      GetConfigurationResponse
    >
  );
};

export const useSetConfiguration = (
  mutationOptions?: Options<SetConfigurationData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    SetConfigurationResponse,
    SetConfigurationError,
    Options<SetConfigurationData>
  >({
    ...setConfigurationMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getConfigurationsQueryKey(),
      });
    },
  });
};

export const useBulkSetConfigurations = (
  mutationOptions?: Options<SetConfigurationsData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    SetConfigurationsResponse,
    SetConfigurationsError,
    Options<SetConfigurationsData>
  >({
    ...setConfigurationsMutation(mutationOptions),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: getConfigurationsQueryKey(),
      });
    },
  });
};
