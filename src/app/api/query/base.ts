import { useEffect, useCallback, useContext } from "react";

import type { QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryKey } from "@/app/api/query-client";
import { WebSocketContext } from "@/app/base/websocket-context";
import type { WebSocketEndpointModel } from "@/websocket-client";
import { WebSocketMessageType } from "@/websocket-client";

export const useWebSocket = () => {
  const websocketClient = useContext(WebSocketContext);

  if (!websocketClient) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  const subscribe = useCallback(
    (callback: (msg: any) => void) => {
      if (!websocketClient.rws) return;

      const messageHandler = (messageEvent: MessageEvent) => {
        const data = JSON.parse(messageEvent.data);
        if (data.type === WebSocketMessageType.NOTIFY) callback(data);
      };
      websocketClient.rws.addEventListener("message", messageHandler);
      return () =>
        websocketClient.rws?.removeEventListener("message", messageHandler);
    },
    [websocketClient]
  );

  return { subscribe };
};

const wsToQueryKeyMapping: Partial<Record<WebSocketEndpointModel, string>> = {
  zone: "zones",
  // Add more mappings as needed
} as const;
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
  const { subscribe } = useWebSocket();
  const queryModelKey = Array.isArray(queryKey) ? queryKey[0] : "";

  // TODO: Investigate why the code below causes the zones endpoint to be polled 50 times on page load
  // https://warthogs.atlassian.net/browse/MAASENG-3558

  // const connectedCount = useSelector(statusSelectors.connectedCount);
  // useEffect(() => {
  //   queryClient.invalidateQueries();
  // }, [connectedCount, queryClient, queryKey]);

  useEffect(() => {
    return subscribe(
      ({ name: model }: { action: string; name: WebSocketEndpointModel }) => {
        const mappedKey = wsToQueryKeyMapping[model];
        const modelQueryKey = queryKey[0];

        if (mappedKey && mappedKey === modelQueryKey) {
          queryClient.invalidateQueries({ queryKey });
        }
      }
    );
  }, [queryClient, subscribe, queryModelKey, queryKey]);

  return useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn,
    ...options,
  });
}
