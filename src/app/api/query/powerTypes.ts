import { useWebsocketAwareQuery } from "./base";

import { queryOptionsWithHeaders } from "@/app/api/utils";
import type {
  ListPowerTypesData,
  ListPowerTypesErrors,
  ListPowerTypesResponses,
  Options,
} from "@/app/apiclient";
import { listPowerTypes } from "@/app/apiclient";
import { listPowerTypesQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";

export const usePowerTypes = (options?: Options<ListPowerTypesData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      ListPowerTypesResponses,
      ListPowerTypesErrors,
      ListPowerTypesData
    >(options, listPowerTypes, listPowerTypesQueryKey(options))
  );
};
