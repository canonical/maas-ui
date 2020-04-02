import { eventChannel } from "redux-saga";
import {
  all,
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
  race,
} from "redux-saga/effects";

import MESSAGE_TYPES from "app/base/constants";
import getCookie from "./utils";
import WebSocketClient from "../../../websocket-client";

/**
 * Whether the data is fetching or has been fetched into state.
 *
 * @param {Object} state - redux state object.
 * @param {String} model - root redux state model (e.g. 'config', 'users')
 * @returns {Boolean} - has data been fetched?
 */
const isLoaded = (state, model) => {
  return state[model].loaded || state[model].loading;
};

/**
 * Dynamically build a websocket url from window.location
 * @param {string} csrftoken - A csrf token string.
 * @return {string} The built websocket url.
 */
const buildWsUrl = (csrftoken) => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.hostname;
  const port = window.location.port;
  return `${protocol}//${host}:${port}/MAAS/ws?csrftoken=${csrftoken}`;
};

/**
 * Create a WebSocket connection via the client.
 */
export function createConnection(csrftoken) {
  return new Promise((resolve, reject) => {
    const url = buildWsUrl(csrftoken);
    const socketClient = new WebSocketClient(url);
    // As the socket automatically tries to reconnect we don't reject this
    // promise, but rather wait for it to eventually connect.
    socketClient.socket.onopen = () => {
      resolve(socketClient);
    };
  });
}

/**
 * Create a channel to handle WebSocket messages.
 */
export function watchMessages(socketClient) {
  return eventChannel((emit) => {
    socketClient.socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      emit(response);
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
    return () => {
      socketClient.socket.close();
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
 * the store is only updated once a notify message has been received.
 */
export function* handleNotifyMessage(response) {
  const action = response.action.toUpperCase();
  const name = response.name.toUpperCase();
  yield put({
    type: `${action}_${name}_NOTIFY`,
    payload: response.data,
  });
}

/**
 * Handle messages received over the WebSocket.
 */
export function* handleMessage(socketChannel, socketClient) {
  while (true) {
    const response = yield take(socketChannel);
    if (response.type === MESSAGE_TYPES.NOTIFY) {
      yield call(handleNotifyMessage, response);
    } else if (response.type === "error") {
      yield put({ type: "WEBSOCKET_ERROR", error: response.message });
    } else if (response.type === "close") {
      yield put({ type: "WEBSOCKET_DISCONNECTED" });
    } else if (response.type === "open") {
      yield put({ type: "WEBSOCKET_CONNECTED" });
    } else {
      // this is a response message
      const action_type = yield call(
        [socketClient, socketClient.getRequest],
        response.request_id
      );
      if (response.error) {
        let error;
        try {
          error = JSON.parse(response.error);
        } catch {
          // the API doesn't consistently return JSON, so we fallback
          // to directly assign the error.
          //
          // https://bugs.launchpad.net/maas/+bug/1840887
          error = response.error;
        }
        yield put({
          type: `${action_type}_ERROR`,
          error,
        });
      } else {
        yield put({ type: `${action_type}_SUCCESS`, payload: response.result });
      }
    }
  }
}

/**
 * An action containing an RPC method is a websocket request action.
 * @param {Object} action.
 * @returns {Bool} - action is a request action.
 */
const isWebsocketRequestAction = (action) => action.meta && action.meta.method;

/**
 * Build a message for websocket requests.
 * @param {Object} meta - action meta object.
 * @param {Object} params - param object (optional).
 * @returns {Object} message - serialisable websocket message.
 */
const buildMessage = (meta, params) => {
  const message = {
    method: `${meta.model}.${meta.method}`,
    type: MESSAGE_TYPES.REQUEST,
  };
  if (params) {
    message.params = params;
  }
  return message;
};

/**
 * Send WebSocket messages via the client.
 */
export function* sendMessage(socketClient, { meta, payload, type }) {
  const params = payload ? payload.params : null;

  const { method, model } = meta;
  // If method is 'list' and data has loaded, do not fetch again.
  if (method.endsWith("list")) {
    const loaded = yield select(isLoaded, model);
    if (loaded) {
      return;
    }
  }

  yield put({ type: `${type}_START` });
  try {
    if (params && Array.isArray(params)) {
      // We deliberately do not yield in parallel here with 'all'
      // to avoid races for dependant config.
      for (let param of params) {
        yield call(
          [socketClient, socketClient.send],
          type,
          buildMessage(meta, param)
        );
        // Ensure server has synced before sending next message,
        // important for dependant config like commissioning_distro_series
        // and default_min_hwe_kernel.
        // There is an edge case where a different CLI or server event could
        // dispatch a NOTIFY of the same type which is received before our expected NOTIFY,
        // but this _probably_ does not matter in practice.
        yield take(`${type}_NOTIFY`);
      }
    } else {
      yield call(
        [socketClient, socketClient.send],
        type,
        buildMessage(meta, params)
      );
    }
  } catch (error) {
    yield put({ type: `${type}_ERROR`, error });
  }
}

/**
 * Connect to the WebSocket and watch for message.
 */
export function* setupWebSocket() {
  try {
    const csrftoken = yield call(getCookie, "csrftoken");
    if (!csrftoken) {
      throw new Error(
        "No csrftoken found, please ensure you are logged into MAAS."
      );
    }
    const socketClient = yield call(createConnection, csrftoken);
    yield put({ type: "WEBSOCKET_CONNECTED" });
    const socketChannel = yield call(watchMessages, socketClient);
    while (true) {
      let { cancel } = yield race({
        task: all([
          call(handleMessage, socketChannel, socketClient),
          // Using takeEvery() instead of call() here to get around this issue:
          // https://github.com/canonical-web-and-design/maas-ui/issues/172
          takeEvery(
            (action) => isWebsocketRequestAction(action),
            sendMessage,
            socketClient
          ),
        ]),
        cancel: take("WEBSOCKET_DISCONNECT"),
      });
      if (cancel) {
        socketChannel.close();
        yield put({ type: "WEBSOCKET_DISCONNECTED" });
      }
    }
  } catch (error) {
    yield put({ type: "WEBSOCKET_ERROR", error: error.message });
  }
}

/**
 * Set up websocket connections when requested.
 */
export function* watchWebSockets() {
  yield takeLatest("WEBSOCKET_CONNECT", setupWebSocket);
}
