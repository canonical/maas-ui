import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  GetBootSourceData,
  GetBootSourceErrors,
  GetBootSourceResponses,
  ListBootSourcesData,
  ListBootSourcesErrors,
  ListBootSourcesResponses,
  Options,
  UpdateBootSourceData,
  UpdateBootSourceErrors,
  UpdateBootSourceResponses,
} from "@/app/apiclient";
import {
  updateBootSource,
  getBootSource,
  listBootSources,
} from "@/app/apiclient";
import {
  getBootSourceQueryKey,
  listBootSourcesQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useImageSources = (options?: Options<ListBootSourcesData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListBootSourcesResponses,
      ListBootSourcesErrors,
      ListBootSourcesData
    >(options, listBootSources, listBootSourcesQueryKey(options))
  );
};

export const useGetImageSource = (
  options: Options<GetBootSourceData>,
  enabled: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetBootSourceResponses,
      GetBootSourceErrors,
      GetBootSourceData
    >(options, getBootSource, getBootSourceQueryKey(options)),
    enabled,
  });
};

export const useUpdateImageSource = (
  mutationOptions?: Options<UpdateBootSourceData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateBootSourceResponses,
      UpdateBootSourceErrors,
      UpdateBootSourceData
    >(mutationOptions, updateBootSource),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listBootSourcesQueryKey(),
      });
    },
  });
};
