import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "@/app/api/query/base";
import { IMAGES_WORKFLOW_KEY } from "@/app/api/query/images";
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
  DeleteBootsourceErrors,
  CreateBootsourceData,
  CreateBootsourceErrors,
  CreateBootsourceResponses,
} from "@/app/apiclient";
import {
  createBootsource,
  deleteBootsource,
  fetchBootsourcesAvailableImages,
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

export const useChangeImageSource = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateBootsourceResponses[keyof CreateBootsourceResponses],
    | CreateBootsourceErrors[keyof CreateBootsourceErrors]
    | DeleteBootsourceErrors[keyof DeleteBootsourceErrors],
    Options<CreateBootsourceData & { body: { current_boot_source_id: number } }>
  >({
    mutationFn: async (params) => {
      // Step 1: Fetch to validate source using URL from createData
      await fetchBootsourcesAvailableImages({
        body: {
          url: params.body.url,
          keyring_filename: params.body.keyring_filename,
          keyring_data: params.body.keyring_data,
          skip_keyring_verification: params.body.skip_keyring_verification,
        },
        throwOnError: true,
      });

      // Step 2: Create new source
      const createResult = await createBootsource({
        ...params,
        throwOnError: true,
      });

      // Step 3: Delete old source
      await deleteBootsource({
        path: { boot_source_id: params.body.current_boot_source_id },
        throwOnError: true,
      });

      return createResult.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [listBootsourcesQueryKey(), IMAGES_WORKFLOW_KEY],
      });
    },
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
