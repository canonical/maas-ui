import type { Options } from "@hey-api/client-fetch";
import {
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  CreateUserSslkeyData,
  CreateUserSslkeyError,
  CreateUserSslkeyResponse,
  GetUserSslkeysData,
  GetUserSslkeysError,
  GetUserSslkeysResponse,
} from "@/app/apiclient";
import {
  createUserSslkeyMutation,
  getUserSslkeysOptions,
  getUserSslkeysQueryKey,
} from "@/app/apiclient/@tanstack/react-query.gen";

export const useGetSslKeys = (options?: Options<GetUserSslkeysData>) => {
  return useWebsocketAwareQuery(
    getUserSslkeysOptions(options) as UseQueryOptions<
      GetUserSslkeysData,
      GetUserSslkeysError,
      GetUserSslkeysResponse
    >
  );
};

export const useCreateSslKeys = (
  mutationOptions?: Options<CreateUserSslkeyData>
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateUserSslkeyResponse,
    CreateUserSslkeyError,
    Options<CreateUserSslkeyData>
  >({
    ...createUserSslkeyMutation(mutationOptions),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getUserSslkeysQueryKey(),
      });
    },
  });
};
