import { eventChannel } from "redux-saga";
import { all, call, put, take, race } from "redux-saga/effects";

import WebSocketClient from "../../../websocket-client";

/**
 * Create a WebSocket connection via the client.
 */
export function createConnection() {
  return new Promise((resolve, reject) => {
    const socketClient = new WebSocketClient(MAAS_config.ui.websocket_url); // eslint-disable-line no-undef
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
    let payload;
    let action;
    const action_type = yield call(
      socketClient.getRequest,
      response.request_id
    );
    if (response.error) {
      action = `${action_type}_ERROR`;
      payload = JSON.parse(response.error);
    } else {
      action = `${action_type}_SUCCESS`;
      payload = response.result;
    }
    yield put({ type: action, payload });
  }
}

/**
 * Send WebSocket messages via the client.
 */
export function* sendMessage(socketClient) {
  while (true) {
    const data = yield take("WEBSOCKET_SEND");
    yield call(
      socketClient.send,
      data.payload.actionType,
      data.payload.message
    );
  }
}

/**
 * Connect to the WebSocket and watch for message.
 */
export function* watchWebSockets() {
  yield take("WEBSOCKET_CONNECT");
  try {
    const socketClient = yield call(createConnection);
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
    yield put({ type: "WEBSOCKET_ERROR" });
  }
}
