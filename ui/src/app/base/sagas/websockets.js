import { eventChannel } from "redux-saga";
import { all, call, put, take, race } from "redux-saga/effects";

import getCookie from "./utils";
import WebSocketClient from "../../../websocket-client";

/**
 * Create a WebSocket connection via the client.
 */
export function createConnection(csrftoken) {
  return new Promise((resolve, reject) => {
    const url = `${MAAS_config.ui.websocket_url}?csrftoken=${csrftoken}`; // eslint-disable-line no-undef
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
 * Handle messages received over the WebSocket.
 */
export function* handleMessage(socketChannel, socketClient) {
  while (true) {
    const response = yield take(socketChannel);
    const action_type = yield call(
      [socketClient, socketClient.getRequest],
      response.request_id
    );
    if (response.error) {
      yield put({
        type: `${action_type}_ERROR`,
        error: JSON.parse(response.error)
      });
    } else {
      yield put({ type: `${action_type}_SUCCESS`, payload: response.result });
    }
  }
}

/**
 * Send WebSocket messages via the client.
 */
export function* sendMessage(socketClient) {
  while (true) {
    const data = yield take("WEBSOCKET_SEND");
    yield put({ type: `${data.payload.actionType}_START` });
    const error = yield call(
      [socketClient, socketClient.send],
      data.payload.actionType,
      data.payload.message
    );
    if (error) {
      yield put({ type: `${data.payload.actionType}_ERROR`, error });
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
