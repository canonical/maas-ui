import { queryOptionsWithHeaders } from "../utils";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListGroupsData,
  ListGroupsErrors,
  ListGroupsResponses,
} from "@/app/apiclient";
import { listGroups } from "@/app/apiclient";
import { listGroupsQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import type { Options } from "@/app/apiclient/client";

export const useGroups = (options?: Options<ListGroupsData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListGroupsResponses,
      ListGroupsErrors,
      ListGroupsData
    >(options, listGroups, listGroupsQueryKey(options))
  );
};
