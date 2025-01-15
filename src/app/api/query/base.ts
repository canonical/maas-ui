import { useEffect, useCallback, useContext } from "react";

import { usePrevious } from "@canonical/react-components";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { WebSocketContext } from "@/app/base/websocket-context";
import statusSelectors from "@/app/store/status/selectors";
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

export const useWebsocketAwareQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
>(
  options?: UseQueryOptions<TQueryFnData, TError, TData>
) => {
  const queryClient = useQueryClient();
  const connectedCount = useSelector(statusSelectors.connectedCount);
  const { subscribe } = useWebSocket();

  const queryModelKey = Array.isArray(options?.queryKey)
    ? options?.queryKey[0]
    : "";
  const previousConnectedCount = usePrevious(connectedCount);

  useEffect(() => {
    if (connectedCount !== previousConnectedCount) {
      queryClient.invalidateQueries({ queryKey: options?.queryKey }).then();
    }
  }, [connectedCount, previousConnectedCount, queryClient, options]);

  useEffect(() => {
    return subscribe(() => {
      const mappedKey = "zones"; // TODO: add support for other endpoints
      const modelQueryKey = options?.queryKey[0];

      if (mappedKey && mappedKey === modelQueryKey) {
        queryClient.invalidateQueries({ queryKey: options?.queryKey }).then();
      }
    });
  }, [queryClient, subscribe, queryModelKey, options]);

  return useQuery<TQueryFnData, TError, TData>(options!);
};
