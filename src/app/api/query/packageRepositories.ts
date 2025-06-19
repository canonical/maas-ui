import type { Options } from "@hey-api/client-fetch";
import type { UseQueryOptions } from "@tanstack/react-query";

import { useWebsocketAwareQuery } from "./base";

import type {
  ListPackageRepositoriesData,
  ListPackageRepositoriesError,
  ListPackageRepositoriesResponse,
} from "@/app/apiclient";
import { listPackageRepositoriesOptions } from "@/app/apiclient/@tanstack/react-query.gen";

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
