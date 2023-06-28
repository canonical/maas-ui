import type { PayloadAction } from "@reduxjs/toolkit";
import { QueryClient, QueryCache } from "@tanstack/react-query";
import type { SagaGenerator } from "typed-redux-saga";
import { takeEvery, call, put, race, take } from "typed-redux-saga/macro";

import { actions as machineActions } from "app/store/machine";
import type { FetchResponse } from "app/store/machine/types";
import type {
  WebSocketAction,
  WebSocketRequest,
  WebSocketResponseResult,
} from "websocket-client";

export const queryCache = new QueryCache();

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 500,
    },
  },
});

export function* updateQueryCache(
  action: PayloadAction<{ meta: { callId: string }; payload: FetchResponse }>
): SagaGenerator<void> {
  // const queryKey = [callId].filter(Boolean);
  // console.warn("action", action.meta, action.payload);
  const { meta, model, callId } = action?.meta || {};

  const queryKey = [meta, model, callId];
  queryClient.setQueryData(queryKey, action.payload);
  yield* put({ type: "queryCacheUpdated" });
}

export function* watchQueryCache(): SagaGenerator<void> {
  yield* takeEvery(
    [
      "machine/deleteNotify",
      "machine/updateNotify",
      "resourcepool/updateNotify",
    ],
    () => queryClient.invalidateQueries(["machine", "list"])
  );
}

// A store of websocket requests that need to store their responses in the query cache. The map is between request id and redux action object.
export const queryCacheRequests = new Map<
  WebSocketRequest["request_id"],
  WebSocketAction
>();

/**
 * Store the actions that need to store files in the file context.
 *
 * @param {Object} action - A Redux action.
 * @param {Array} requestIDs - A list of ids for the requests associated with
 * this action.
 */
export function storeQueryCacheActions(
  action: WebSocketAction,
  requestIDs: WebSocketRequest["request_id"][]
): void {
  if (action?.meta?.callId) {
    requestIDs.forEach((id) => {
      queryCacheRequests.set(id, action);
    });
  }
}

/**
 * Handle storing the result in query cache, if required.
 *
 * @param {Object} response - A websocket response.
 */
export function* handleQueryCacheRequest({
  request_id,
  result,
}: WebSocketResponseResult<string>): SagaGenerator<boolean> {
  const queryCacheRequest = yield* call(
    [queryCacheRequests, queryCacheRequests.get],
    request_id
  );
  if (queryCacheRequest?.meta.callId) {
    const { model, method } = queryCacheRequest.meta;
    const queryKey = [model, method, JSON.stringify(queryCacheRequest.payload)];
    queryClient.setQueryData(queryKey, result);

    // dispatch success with "from cache" or something like that
    yield* put({
      type: "queryCacheUpdated",
      payload: queryKey,
      data: queryClient.getQueryData(queryKey),
    });
    // Clean up the previous request.
    queryCacheRequests.delete(request_id);
  }
  return !!queryCacheRequest;
}

function* fetchMachinesAndResolveSaga(action) {
  const { resolve, reject, callId } = action?.meta || {};

  // Wait for either the success or failure action to be dispatched
  const { success, failure } = yield race({
    success: take(
      (action) =>
        action.meta?.callId === callId && action.type.endsWith("Success")
    ),
    failure: take(
      (action) =>
        action.meta?.callId === callId && action.type.endsWith("Error")
    ),
  });

  if (success) {
    resolve(success.payload); // resolve with the payload from fetchSuccess
  } else {
    reject(new Error(failure.payload)); // reject with the payload from fetchFailure wrapped in an Error object
  }
}

export function* watchFetchMachinesAndResolve() {
  yield takeEvery(
    [machineActions.fetch.type, machineActions.count.type],
    fetchMachinesAndResolveSaga
  );
}
