import type {
  Event as ReconnectingWebSocketEvent,
  ErrorEvent,
  CloseEvent,
} from "reconnecting-websocket";
import type { AnyAction } from "redux";
import type { EventChannel } from "redux-saga";
import { eventChannel } from "redux-saga";
import type { SagaGenerator } from "typed-redux-saga/macro";
import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
  race,
} from "typed-redux-saga/macro";

import { WebSocketMessageType } from "../../../websocket-client";
import type {
  WebSocketAction,
  WebSocketClient,
  WebSocketEndpoint,
  WebSocketRequest,
  WebSocketRequestMessage,
  WebSocketResponseNotify,
  WebSocketResponseResult,
  WebSocketActionParams,
} from "../../../websocket-client";

import type { MessageHandler, NextActionCreator } from "./actions";

import { fileContextStore } from "app/base/file-context";

const DEFAULT_POLL_INTERVAL = 10000;

export type WebSocketChannel = EventChannel<
  | ReconnectingWebSocketEvent
  | ErrorEvent
  | CloseEvent
  // The reponse from the websocket API will be a JSON string.
  | MessageEvent<string>
>;

let loadedEndpoints: WebSocketEndpoint[] = [];

// A map of request ids to action creators. This is used to dispatch actions
// when a response is received.
export const nextActions = new Map<
  WebSocketRequest["request_id"],
  NextActionCreator[]
>();

// A store of websocket requests that need to be called to fetch the next batch
// of data. The map is between request id and redux action object.
export const batchRequests = new Map<
  WebSocketRequest["request_id"],
  WebSocketAction
>();

// A store of websocket requests that need to store their responses in the file
// context. The map is between request id and redux action object.
export const fileContextRequests = new Map<
  WebSocketRequest["request_id"],
  WebSocketAction
>();

// A store of websocket endpoints that are being polled.
const pollingRequests = new Set<WebSocketEndpoint>();

/**
 * Whether the data is fetching or has been fetched into state.
 *
 * @param endpoint - root redux model and method (e.g. 'users.list')
 * @returns - has data been fetched?
 */
const isLoaded = (endpoint: WebSocketEndpoint) => {
  return loadedEndpoints.includes(endpoint);
};

/**
 * Mark a model as having been fetched into state.
 *
 * @param endpoint - root redux state model and method (e.g. 'users.list')
 */
const setLoaded = (endpoint: WebSocketEndpoint) => {
  if (!isLoaded(endpoint)) {
    loadedEndpoints.push(endpoint);
  }
};
/**
 * Reset the list of loaded endpoints.
 *
 */
const resetLoaded = () => {
  loadedEndpoints = [];
};

/**
 * Create a WebSocket connection via the client.
 */
export function createConnection(
  websocketClient: WebSocketClient
): Promise<WebSocketClient> {
  // As the socket automatically tries to reconnect we don't reject this
  // promise, but rather wait for it to eventually connect.
  return new Promise((resolve, reject) => {
    const readyState = websocketClient.socket?.readyState;
    if (readyState === WebSocket.OPEN) {
      resolve(websocketClient);
      return;
    } else if (
      !websocketClient.socket ||
      (readyState && [WebSocket.CLOSED, WebSocket.CLOSING].includes(readyState))
    ) {
      try {
        // Check that the csrftoken etc. exist to create the connection. The
        // check is done here because we don't want to reject errors when
        // connecting so that the reconnecting websocket can keep trying.
        websocketClient.buildURL();
      } catch (error) {
        reject(error);
      }
      websocketClient.connect();
    }
    if (websocketClient.socket) {
      websocketClient.socket.onopen = () => {
        resolve(websocketClient);
      };
    }
  });
}

/**
 * Create a channel to handle WebSocket messages.
 */
export function watchMessages(socketClient: WebSocketClient): WebSocketChannel {
  return eventChannel((emit) => {
    if (socketClient.socket) {
      socketClient.socket.onmessage = (event) => {
        emit(event);
      };
      socketClient.socket.onopen = (event) => {
        emit(event);
      };
      socketClient.socket.onerror = (event) => {
        emit(event);
      };
      socketClient.socket.onclose = (event) => {
        emit(event);
      };
    }
    return () => {
      socketClient.socket?.close();
    };
  });
}

/**
 * Handle incoming notify messages.
 *
 * Notify messages have an action and a payload:
 * {"type": 2,
 *  "name": "config",
 *  "action": "update",
 *  "data": {"name": "maas_name", "value": "maas-hysteria"}}
 *
 * Although we receive a corresponding response for each websocket requests,
 * in some cases the store is only updated once a notify message has been received.
 */
export function* handleNotifyMessage({
  action,
  data,
  name,
}: WebSocketResponseNotify): SagaGenerator<void> {
  yield* put({
    type: `${name}/${action}Notify`,
    payload: data,
  });
}

/**
 * Store batch requests, if this is a batch action.
 *
 * @param {Object} action - A Redux action.
 * @param {Array} requestIDs - A list of ids for the requests associated with
 * this action.
 */
function queueBatch(
  action: WebSocketAction,
  requestIDs: WebSocketRequest["request_id"][]
) {
  // If the action has a limit then it is a batch request. An action can send
  // multiple requests so each one needs to be mapped to the action.
  if (
    !Array.isArray(action?.payload?.params) &&
    action?.payload?.params?.limit &&
    action?.meta?.batch
  ) {
    requestIDs.forEach((id) => {
      batchRequests.set(id, action);
    });
  }
}

/**
 * Handle sending the next batch request, if required.
 *
 * @param {Object} response - A websocket response.
 */
export function* handleBatch({
  request_id,
  result,
}: WebSocketResponseResult): SagaGenerator<void> {
  const batchRequest = yield* call(
    [batchRequests, batchRequests.get],
    request_id
  );
  if (batchRequest && Array.isArray(result)) {
    if (!batchRequest.payload) {
      batchRequest.payload = {};
    }
    if (!batchRequest.payload?.params) {
      batchRequest.payload.params = {};
    }
    // This is a batch request so check if we received a full batch, if so
    // then send another request.
    if (
      !Array.isArray(batchRequest.payload.params) &&
      batchRequest.payload.params.limit === result.length
    ) {
      // Clean up the previous request.
      batchRequests.delete(request_id);
      // Set the next batch to start at the last id we received.
      const nextBatch = { ...batchRequest };
      // If the action has a subsequentLimit then we need to raise the limit
      // after the first request.
      if (nextBatch?.meta?.subsequentLimit) {
        // Set the limit to the subsequentLimit value.
        batchRequest.payload.params.limit = nextBatch.meta.subsequentLimit;
        // Remove the subsequentLimit attribute as we've already raised the
        // limit and further actions should remain at this value.
        delete nextBatch.meta.subsequentLimit;
      }
      if (!nextBatch.payload) {
        nextBatch.payload = {};
      }
      if (!nextBatch.payload?.params) {
        nextBatch.payload.params = {};
      }
      if (!Array.isArray(nextBatch.payload.params)) {
        nextBatch.payload.params.start = result[result.length - 1].id;
      }
      // Send the new request.
      yield* put(nextBatch);
    } else {
      yield* put({ type: `${batchRequest.type}Complete` });
    }
  }
}

/**
 * Store the actions to dispatch when the response is received.
 *
 * @param {Object} action - A Redux action.
 * @param {Array} requestIDs - A list of ids for the requests associated with
 * this action.
 */
function* storeNextActions(
  requestIDs: WebSocketRequest["request_id"][],
  nextActionCreators?: NextActionCreator[]
) {
  if (nextActionCreators) {
    for (const id of requestIDs) {
      yield call([nextActions, nextActions.set], id, nextActionCreators);
    }
  }
}

/**
 * Handle dispatching the next actions, if required.
 *
 * @param {Object} response - A websocket response.
 */
export function* handleNextActions({
  request_id,
  result,
}: WebSocketResponseResult): SagaGenerator<void> {
  const actionCreators = yield* call(
    [nextActions, nextActions.get],
    request_id
  );
  if (actionCreators && actionCreators.length) {
    for (const actionCreator of actionCreators) {
      // Generate the action object using the result from the response.
      const action = yield* call(actionCreator, result);
      // Dispatch the action.
      yield* put(action);
    }
    // Clean up the stored action creators.
    yield* call([nextActions, nextActions.delete], request_id);
  }
}

/**
 * Store the actions that need to store files in the file context.
 *
 * @param {Object} action - A Redux action.
 * @param {Array} requestIDs - A list of ids for the requests associated with
 * this action.
 */
export function storeFileContextActions(
  action: WebSocketAction,
  requestIDs: WebSocketRequest["request_id"][]
): void {
  if (action?.meta?.useFileContext) {
    requestIDs.forEach((id) => {
      fileContextRequests.set(id, action);
    });
  }
}

/**
 * Handle storing a file in the file context store, if required.
 *
 * @param {Object} response - A websocket response.
 */
export function* handleFileContextRequest({
  request_id,
  result,
}: WebSocketResponseResult<string>): SagaGenerator<boolean> {
  const fileContextRequest = yield* call(
    [fileContextRequests, fileContextRequests.get],
    request_id
  );
  if (fileContextRequest?.meta.fileContextKey) {
    // Store the file in the context.
    fileContextStore.add(fileContextRequest.meta.fileContextKey, result);
    // Clean up the previous request.
    batchRequests.delete(request_id);
  }
  return !!fileContextRequest;
}

/**
 * Run a timer to keep dispatching an action.
 * @param action - A websocket action.
 */
export function* pollAction(action: WebSocketAction): SagaGenerator<void> {
  const endpoint = `${action.meta?.model}.${action.meta?.method}`;
  try {
    while (true) {
      // The delay is put first as the action will have already been handled
      // when it is first dispatched, so this should start by waiting until the
      // next interval.
      yield* delay(action.meta?.pollInterval || DEFAULT_POLL_INTERVAL);
      yield* put(action);
    }
  } finally {
    if (yield* cancelled()) {
      yield* put({ type: `${action.type}PollingStopped` });
      pollingRequests.delete(endpoint);
    }
  }
}

/**
 * Handle starting and stopping a polling action.
 * @param action - A websocket action.
 */
export function* handlePolling(action: WebSocketAction): SagaGenerator<void> {
  const endpoint = `${action.meta?.model}.${action.meta?.method}`;
  pollingRequests.add(endpoint);
  let poll = true;
  while (poll) {
    yield* put({ type: `${action.type}PollingStarted` });
    // Start polling the action.
    const pollingTask = yield* fork(pollAction, action);
    // Wait for the stop polling action for this endpoint.
    yield* take(
      (dispatchedAction: AnyAction) =>
        isStopPollingAction(dispatchedAction) &&
        `${dispatchedAction.meta?.model}.${dispatchedAction.meta?.method}` ===
          endpoint
    );
    // Cancel polling.
    yield* cancel(pollingTask);
    // Exit the while loop.
    poll = false;
  }
}

/**
 * Handle messages received over the WebSocket.
 */
export function* handleMessage(
  socketChannel: WebSocketChannel,
  socketClient: WebSocketClient
): SagaGenerator<void> {
  while (true) {
    const websocketEvent = yield* take(socketChannel);
    if (websocketEvent.type === "error") {
      if ("message" in websocketEvent) {
        yield* put({
          error: true,
          payload: websocketEvent.message,
          type: "status/websocketError",
        });
      }
    } else if (websocketEvent.type === "close") {
      yield* put({ type: "status/websocketDisconnected" });
    } else if (websocketEvent.type === "open") {
      yield* put({ type: "status/websocketConnected" });
      resetLoaded();
    } else if ("data" in websocketEvent) {
      const response = JSON.parse(websocketEvent.data);
      if (response.type === WebSocketMessageType.NOTIFY) {
        yield* call(handleNotifyMessage, response);
      } else {
        // This is a response message, fetch the corresponding action for the
        // message that was sent.
        const action = yield* call(
          [socketClient, socketClient.getRequest],
          response.request_id
        );
        // Handle file context requests, if required.
        const isFileContextRequest = yield* call(
          handleFileContextRequest,
          response
        );
        if (!action) {
          return;
        }
        // Depending on the action the parameters might be contained in the
        // `params` parameter.
        const item = action.payload?.params || action.payload;
        let error;
        let result;
        if (response.error) {
          try {
            error = JSON.parse(response.error);
          } catch {
            // the API doesn't consistently return JSON, so we fallback
            // to directly assign the error.
            //
            // https://bugs.launchpad.net/maas/+bug/1840887
            error = response.error;
          }
        } else {
          if (isFileContextRequest) {
            // If this uses the file context then don't dispatch the response
            // payload.
            result = null;
          } else if (action.meta?.jsonResponse) {
            try {
              if (typeof response.result === "string") {
                result = JSON.parse(response.result);
              }
            } catch {
              error = "Error parsing API response";
            }
          } else {
            result = response.result;
          }
        }
        if (error) {
          yield* put({
            meta: { item },
            type: `${action.type}Error`,
            error: true,
            payload: error,
          });
        } else {
          yield* put({
            meta: { item },
            type: `${action.type}Success`,
            payload: result,
          });
          // Handle batching, if required.
          yield* call(handleBatch, response);
          // Handle dispatching next actions, if required.
          yield* call(handleNextActions, response);
        }
      }
    }
  }
}

/**
 * Whether this action is already being polled.
 * @param {Object} action.
 * @returns {Bool} - action is a request action.
 */
const isPolling = (action: AnyAction): boolean =>
  pollingRequests.has(`${action.meta?.model}.${action.meta?.method}`);

/**
 * Whether this is an action that starts polling a websocket request.
 * @param {Object} action.
 * @returns {Bool} - action is a request action.
 */
const isStartPollingAction = (action: AnyAction): boolean =>
  Boolean(action?.meta?.poll) &&
  // Ignore actions that are already being polled.
  !isPolling(action);

/**
 * Whether this is an action that stops polling a websocket request.
 * @param {Object} action.
 * @returns {Bool} - action is a request action.
 */
const isStopPollingAction = (action: AnyAction): boolean =>
  Boolean(action?.meta?.pollStop);

/**
 * An action containing an RPC method is a websocket request action.
 * @param {Object} action.
 * @returns {Bool} - action is a request action.
 */
const isWebsocketRequestAction = (action: AnyAction): boolean =>
  Boolean(action?.meta?.method && action?.meta?.model) &&
  // Ignore actions that are for stopping the polling action.
  !isStopPollingAction(action);

/**
 * Build a message for websocket requests.
 * @param {Object} meta - action meta object.
 * @param {Object} params - param object (optional).
 * @returns {Object} message - serialisable websocket message.
 */
const buildMessage = (
  meta: WebSocketAction["meta"],
  params?: WebSocketActionParams | null
) => {
  const message: WebSocketRequestMessage = {
    method: `${meta.model}.${meta.method}`,
    type: WebSocketMessageType.REQUEST,
  };
  if (params && !Array.isArray(params)) {
    message.params = params;
  }
  return message;
};

/**
 * Send WebSocket messages via the client.
 */
export function* sendMessage(
  socketClient: WebSocketClient,
  action: WebSocketAction,
  nextActionCreators?: NextActionCreator[]
): SagaGenerator<void> {
  const { meta, payload, type } = action;
  const params = payload ? payload.params : null;
  const { cache, method, model, nocache } = meta;
  const endpoint = `${model}.${method}`;
  // If method is 'list' and data has loaded/is loading, do not fetch again
  // unless this is fetching a new batch or 'nocache' is specified.
  if (
    cache ||
    (method.endsWith("list") &&
      (!params || Array.isArray(params) || !params.start) &&
      !nocache)
  ) {
    if (isLoaded(endpoint)) {
      return;
    }
    setLoaded(endpoint);
  }
  yield* put({ meta: { item: params || payload }, type: `${type}Start` });
  const requestIDs = [];
  try {
    if (params && Array.isArray(params)) {
      // We deliberately do not * in parallel here with 'all'
      // to avoid races for dependant config.
      for (const param of params) {
        const id = yield* call(
          [socketClient, socketClient.send],
          action,
          buildMessage(meta, param)
        );
        requestIDs.push(id);
        // Ensure server has synced before sending next message,
        // important for dependant config like commissioning_distro_series
        // and default_min_hwe_kernel.
        // There is an edge case where a different CLI or server event could
        // dispatch a NOTIFY of the same type which is received before our expected NOTIFY,
        // but this _probably_ does not matter in practice.
        yield* take(`${type}Notify`);
      }
    } else {
      const id = yield* call(
        [socketClient, socketClient.send],
        action,
        buildMessage(meta, params)
      );
      requestIDs.push(id);
    }
    // Store the actions to dispatch when the response is received.
    yield* call(storeNextActions, requestIDs, nextActionCreators);
    // Queue batching, if required.
    yield* call(queueBatch, action, requestIDs);
    // Store the actions that need to use the file context.
    yield* call(storeFileContextActions, action, requestIDs);
  } catch (error) {
    yield* put({
      meta: { item: params || payload },
      type: `${type}Error`,
      error: true,
      payload: error,
    });
  }
}

/**
 * Connect to the WebSocket and watch for message.
 * @param {Array} messageHandlers - Sagas that should handle specific messages
 * via the websocket channel.
 */
export function* setupWebSocket(
  websocketClient: WebSocketClient,
  messageHandlers: MessageHandler[] = []
): SagaGenerator<void> {
  try {
    const socketClient = yield* call(createConnection, websocketClient);
    yield* put({ type: "status/websocketConnected" });
    // Set up the list of models that have been loaded.
    resetLoaded();
    const socketChannel = yield* call(watchMessages, socketClient);
    while (true) {
      const { cancel } = yield* race({
        task: all(
          [
            call(handleMessage, socketChannel, socketClient),
            // Using takeEvery() instead of call() here to get around this issue:
            // https://github.com/canonical-web-and-design/maas-ui/issues/172
            takeEvery<
              WebSocketAction,
              (socketClient: WebSocketClient, action: WebSocketAction) => void
            >(isWebsocketRequestAction, sendMessage, socketClient),
            // Take actions that should start polling.
            takeEvery<WebSocketAction, (action: WebSocketAction) => void>(
              isStartPollingAction,
              handlePolling
            ),
          ].concat(
            // Attach the additional actions that should be taken by the
            // websocket channel.
            messageHandlers.map(({ action, method }) =>
              takeEvery(action, method, socketClient, sendMessage)
            )
          )
        ),
        cancel: take("status/websocketDisconnect"),
      });
      if (cancel) {
        socketChannel.close();
        yield* put({ type: "status/websocketDisconnected" });
      }
    }
  } catch (error) {
    yield* put({
      type: "status/websocketError",
      error: true,
      payload: error.message,
    });
  }
}

/**
 * Set up websocket connections when requested.
 * @param {Array} messageHandlers - Additional sagas to be handled by the
 * websocket channel.
 */
export function* watchWebSockets(
  websocketClient: WebSocketClient,
  messageHandlers?: MessageHandler[]
): SagaGenerator<void> {
  yield* takeLatest(
    "status/websocketConnect",
    setupWebSocket,
    websocketClient,
    messageHandlers
  );
}
