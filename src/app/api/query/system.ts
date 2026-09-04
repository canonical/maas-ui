import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  GetSystemInfoData,
  GetSystemInfoError,
  GetSystemInfoResponse,
} from "@/app/apiclient";
import { getSystemInfoOptions } from "@/app/apiclient/@tanstack/react-query.gen";
import type { Options } from "@/app/apiclient/client";

export const useSystemInfo = (options?: Options<GetSystemInfoData>) => {
  return useWebsocketAwareQuery(
    getSystemInfoOptions(options) as UseQueryOptions<
      GetSystemInfoData,
      GetSystemInfoError,
      GetSystemInfoResponse
    >
  );
};
