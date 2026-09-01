import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListSshHostKeysData,
  ListSshHostKeysError,
  ListSshHostKeysResponse,
  Options,
} from "@/app/apiclient";
import { listSshHostKeysOptions } from "@/app/apiclient/@tanstack/react-query.gen";

export const useTrustedSshHostKeys = (
  options?: Options<ListSshHostKeysData>
) => {
  return useWebsocketAwareQuery(
    listSshHostKeysOptions(options) as UseQueryOptions<
      ListSshHostKeysData,
      ListSshHostKeysError,
      ListSshHostKeysResponse
    >
  );
};
