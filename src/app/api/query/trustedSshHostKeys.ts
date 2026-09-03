import { useWebsocketAwareQuery } from "./base";

import { queryOptionsWithHeaders } from "@/app/api/utils";
import type {
  ListSshHostKeysData,
  ListSshHostKeysErrors,
  ListSshHostKeysResponses,
  Options,
} from "@/app/apiclient";
import { listSshHostKeys } from "@/app/apiclient";
import { listSshHostKeysQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";

export const useTrustedSshHostKeys = (
  options?: Options<ListSshHostKeysData>
) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListSshHostKeysResponses,
      ListSshHostKeysErrors,
      ListSshHostKeysData
    >(options, listSshHostKeys, listSshHostKeysQueryKey(options))
  );
};
