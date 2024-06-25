import { useEffect } from "react";

import type { QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import type { QueryKey } from "@/app/api/query-client";
import statusSelectors from "@/app/store/status/selectors";

export function useWebsocketAwareQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >
) {
  const queryClient = useQueryClient();
  const connectedCount = useSelector(statusSelectors.connectedCount);

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [connectedCount, queryClient, queryKey]);

  return useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn,
    ...options,
  });
}
