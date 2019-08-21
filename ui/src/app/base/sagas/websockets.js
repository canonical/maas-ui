import { eventChannel } from "redux-saga";
import { all, call, put, select, take, race } from "redux-saga/effects";

import getCookie from "./utils";
import WebSocketClient from "../../../websocket-client";

const SYNC_MESSAGE = 2; // 'type: 2' in a ws message

/**
 * Has data already been fetched into state?
 *
 * @param {Object} state - redux state object.
 * @param {String} model - root redux state model (e.g. 'config', 'users')
 * @returns {Boolean} - has data been fetched?
 */
const isLoaded = (state, model) => {
  return state[model].loaded;
};

/**
 * Dynamically build a websocket url from window.location
 * @param {string} csrftoken - A csrf token string.
 * @return {string} The built websocket url.
 */
const buildWsUrl = csrftoken => {
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
    let url;
    if (process.env.REACT_APP_WEBSOCKET_URL) {
      url = `${process.env.REACT_APP_WEBSOCKET_URL}?csrftoken=${csrftoken}`;
    } else {
      url = buildWsUrl(csrftoken);
    }
    const socketClient = new WebSocketClient(url);
    socketClient.socket.onopen = () => {
      resolve(socketClient);
    };
    socketClient.socket.onerror = evt => {
      reject(evt);
    };
  });
}

/**
 * Create a channel to handle WebSocket messages.
 */
export function watchMessages(socketClient) {
  return eventChannel(emit => {
    socketClient.socket.onmessage = event => {
      const response = JSON.parse(event.data);
      emit(response);
    };
    return () => {
      socketClient.socket.close();
    };
  });
}

/**
 * Handle incoming 'sync' messages.
 *
 * 'sync' messages have an action and a payload:
 * {"type": 2,
 *  "name": "config",
 *  "action": "update",
 *  "data": {"name": "maas_name", "value": "maas-hysteria"}}
 *
 * Although we receive a corresponding response for each websocket requests,
 * the store is only updated once a sync message has been received.
 */
export function* handleSyncMessage(response) {
  const action = response.action.toUpperCase();
  const name = response.name.toUpperCase();
  yield put({
    type: `${action}_${name}_SYNC`,
    payload: response.data
  });
}

/**
 * Handle messages received over the WebSocket.
 */
export function* handleMessage(socketChannel, socketClient) {
  while (true) {
    const response = yield take(socketChannel);
    if (response.type === SYNC_MESSAGE) {
      // this is an incoming 'sync' message
      yield call(handleSyncMessage, response);
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
          error
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
const isWebsocketRequestAction = action => action.meta && action.meta.method;

/**
 * Build a message for websocket requests.
 * @param {Object} meta - action meta object.
 * @param {Object} params - param object (optional).
 * @returns {Object} message - serialisable websocket message.
 */
const buildMessage = (meta, params) => {
  const message = {
    method: `${meta.model}.${meta.method}`,
    type: meta.type
  };
  if (params) {
    message.params = params;
  }
  return message;
};

/**
 * Send WebSocket messages via the client.
 */
export function* sendMessage(socketClient) {
  while (true) {
    const data = yield take(action => isWebsocketRequestAction(action));
    const { type, meta } = data;
    const params = data.payload ? data.payload.params : null;

    const { method, model } = meta;
    // If method is 'list' and data has loaded, do not fetch again.
    if (method.endsWith("list")) {
      const loaded = yield select(isLoaded, model);
      if (loaded) {
        continue;
      }
    }

    yield put({ type: `${type}_START` });
    try {
      if (params && Array.isArray(params)) {
        yield all(
          params.map(param =>
            call(
              [socketClient, socketClient.send],
              type,
              buildMessage(meta, param)
            )
          )
        );
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
}

/**
 * Connect to the WebSocket and watch for message.
 */
export function* watchWebSockets() {
  yield take("WEBSOCKET_CONNECT");
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
          call(sendMessage, socketClient)
        ]),
        cancel: take("WEBSOCKET_STOP")
      });
      if (cancel) {
        socketChannel.close();
      }
    }
  } catch (error) {
    yield put({ type: "WEBSOCKET_ERROR", error });
  }
}
