import { useWebsocketAwareQuery } from "./base";

import { queryOptionsWithHeaders } from "@/app/api/utils";
import type {
  GetSystemInfoData,
  GetSystemInfoErrors,
  GetSystemInfoResponses,
  Options,
} from "@/app/apiclient";
import { getSystemInfo } from "@/app/apiclient";
import { getSystemInfoQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";

export const useSystemInfo = (options?: Options<GetSystemInfoData>) => {
  return useWebsocketAwareQuery(
    queryOptionsWithHeaders<
      GetSystemInfoResponses,
      GetSystemInfoErrors,
      GetSystemInfoData
    >(options, getSystemInfo, getSystemInfoQueryKey(options))
  );
};
