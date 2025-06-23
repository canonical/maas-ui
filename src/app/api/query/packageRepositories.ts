import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreatePackageRepositoryData,
  CreatePackageRepositoryError,
  CreatePackageRepositoryResponse,
  GetPackageRepositoryData,
  GetPackageRepositoryError,
  GetPackageRepositoryResponse,
  ListPackageRepositoriesData,
  ListPackageRepositoriesError,
  ListPackageRepositoriesResponse,
  Options,
  UpdatePackageRepositoryData,
  UpdatePackageRepositoryError,
  UpdatePackageRepositoryResponse,
} from "@/app/apiclient";
import {
  createPackageRepositoryMutation,
  getPackageRepositoryOptions,
  listPackageRepositoriesOptions,
  listPackageRepositoriesQueryKey,
  updatePackageRepositoryMutation,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const usePackageRepositories = (
  options?: Options<ListPackageRepositoriesData>
) => {
  return useWebsocketAwareQuery(
    listPackageRepositoriesOptions(options) as UseQueryOptions<
      ListPackageRepositoriesData,
      ListPackageRepositoriesError,
      ListPackageRepositoriesResponse
    >
  );
};

export const useGetPackageRepository = (
  options: Options<GetPackageRepositoryData>
) => {
  return useWebsocketAwareQuery(
    getPackageRepositoryOptions(options) as UseQueryOptions<
      GetPackageRepositoryData,
      GetPackageRepositoryError,
      GetPackageRepositoryResponse
    >
  );
};

export const useCreatePackageRepository = (
  mutationOptions?: Options<CreatePackageRepositoryData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreatePackageRepositoryResponse,
    CreatePackageRepositoryError,
    Options<CreatePackageRepositoryData>
  >({
    ...createPackageRepositoryMutation(mutationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listPackageRepositoriesQueryKey(),
      });
    },
  });
};

export const useUpdatePackageRepository = (
  mutationOptions?: Options<UpdatePackageRepositoryData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdatePackageRepositoryResponse,
    UpdatePackageRepositoryError,
    Options<UpdatePackageRepositoryData>
  >({
    ...updatePackageRepositoryMutation(mutationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: listPackageRepositoriesQueryKey(),
      });
    },
  });
};
