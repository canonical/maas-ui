import { useEffect, useCallback, useContext } from "react";

import { usePrevious } from "@canonical/react-components";
import type { QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import type { QueryKey } from "@/app/api/query-client";
import { WebSocketContext } from "@/app/base/websocket-context";
import statusSelectors from "@/app/store/status/selectors";
import type { WebSocketEndpointModel } from "@/websocket-client";
import { WebSocketMessageType } from "@/websocket-client";

/**
 * Provides a hook to subscribe to NOTIFY messages from the websocket.
 *
 * @returns An object with a subscribe function that takes a callback to run when a NOTIFY message is received.
 */
export const useWebSocket = () => {
  const websocketClient = useContext(WebSocketContext);

  if (!websocketClient) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  // Listen for NOTIFY messages and run a callback when received
  const subscribe = useCallback(
    (callback: (msg: any) => void) => {
      if (!websocketClient.rws) return;

      const messageHandler = (messageEvent: MessageEvent) => {
        const data = JSON.parse(messageEvent.data);
        // if we get a NOTIFY, run the provided callback
        if (data.type === WebSocketMessageType.NOTIFY) callback(data);
      };
      // add an event listener for NOTIFY messages
      websocketClient.rws.addEventListener("message", messageHandler);

      // this is a function to remove that event listener, it gets called in a cleanup effect down below.
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

/**
 * A function to run a query which invalidates the query cache when a
 * websocket message is received, or when the websocket reconnects.
 *
 * @param queryKey The query key to use
 * @param queryFn The query function to run
 * @param options Options for useQuery
 * @returns The return value of useQuery
 */
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
  const { subscribe } = useWebSocket();

  const queryModelKey = Array.isArray(queryKey) ? queryKey[0] : "";
  const previousConnectedCount = usePrevious(connectedCount);

  useEffect(() => {
    // connectedCount will change if the websocket reconnects - if this happens, we should invalidate the query
    if (connectedCount !== previousConnectedCount) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [connectedCount, previousConnectedCount, queryClient, queryKey]);

  useEffect(() => {
    // subscribe returns a function to remove the event listener for NOTIFY messages;
    // This function will be used as the cleanup function for the effect.
    return subscribe(
      // This callback function will be called when a NOTIFY message is received
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
