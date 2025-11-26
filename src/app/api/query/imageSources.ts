import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import {
  mutationOptionsWithHeaders,
  queryOptionsWithHeaders,
} from "@/app/api/utils";
import type {
  GetBootsourceData,
  GetBootsourceErrors,
  GetBootsourceResponses,
  ListBootsourcesData,
  ListBootsourcesErrors,
  ListBootsourcesResponses,
  Options,
  UpdateBootsourceData,
  UpdateBootsourceErrors,
  UpdateBootsourceResponses,
} from "@/app/apiclient";
import {
  updateBootsource,
  getBootsource,
  listBootsources,
} from "@/app/apiclient";
import {
  getBootsourceQueryKey,
  listBootsourcesQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useImageSources = (options?: Options<ListBootsourcesData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListBootsourcesResponses,
      ListBootsourcesErrors,
      ListBootsourcesData
    >(options, listBootsources, listBootsourcesQueryKey(options))
  );
};

export const useGetImageSource = (
  options: Options<GetBootsourceData>,
  enabled: boolean
) => {
  return useWebsocketAwareQuery({
    ...queryOptionsWithHeaders<
      GetBootsourceResponses,
      GetBootsourceErrors,
      GetBootsourceData
    >(options, getBootsource, getBootsourceQueryKey(options)),
    enabled,
  });
};

export const useUpdateImageSource = (
  mutationOptions?: Options<UpdateBootsourceData>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...mutationOptionsWithHeaders<
      UpdateBootsourceResponses,
      UpdateBootsourceErrors,
      UpdateBootsourceData
    >(mutationOptions, updateBootsource),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: listBootsourcesQueryKey(),
      });
    },
  });
};
