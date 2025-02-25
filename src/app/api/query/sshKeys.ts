import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListUserSshkeysData,
  ListUserSshkeysError,
  ListUserSshkeysResponse,
} from "@/app/apiclient";
import { listUserSshkeysOptions } from "@/app/apiclient/@tanstack/react-query.gen";

export const useListSshKeys = (options?: Options<ListUserSshkeysData>) => {
  return useWebsocketAwareQuery(
    listUserSshkeysOptions(options) as UseQueryOptions<
      ListUserSshkeysData,
      ListUserSshkeysError,
      ListUserSshkeysResponse
    >
  );
};
