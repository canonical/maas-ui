import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";

import {
  createConnection,
  handleMessage,
  sendMessage,
  watchMessages,
  watchWebSockets
} from "./websockets";

jest.mock("../../../websocket-client");

describe.skip("websocket sagas", () => {
  let socketChannel, socketClient;
  beforeEach(() => {
    socketClient = {
      getRequest: jest.fn(),
      send: jest.fn()
    };
    socketChannel = jest.fn();
  });

  it("connects to a WebSocket", () => {
    return expectSaga(watchWebSockets)
      .take("WEBSOCKET_CONNECT")
      .provide([[call(createConnection), {}]])
      .put({
        type: "WEBSOCKET_CONNECTED"
      })
      .dispatch({
        type: "WEBSOCKET_CONNECT"
      })
      .run();
  });

  it("stops a WebSocket connection", () => {
    return expectSaga(watchWebSockets)
      .provide([[call(createConnection), {}], [call(watchMessages), {}]])
      .take("WEBSOCKET_CONNECT")
      .take("WEBSOCKET_STOP")
      .dispatch({
        type: "WEBSOCKET_CONNECT"
      })
      .dispatch({
        type: "WEBSOCKET_STOP"
      })
      .run();
  });

  it("can handle WebSocket errors", () => {});

  it("can send a WebSocket message", () => {
    return expectSaga(sendMessage, socketClient)
      .take("WEBSOCKET_SEND")
      .call(socketClient.send, "TEST_ACTION", { payload: "here" })
      .dispatch({
        type: "WEBSOCKET_SEND",
        payload: {
          actionType: "TEST_ACTION",
          message: { payload: "here" }
        }
      })
      .run();
  });

  it("can receive a succesful WebSocket message", () => {
    socketClient.getRequest.mockReturnValue = "TEST_ACTION";
    return expectSaga(handleMessage, socketChannel, socketClient)
      .provide([
        {
          take({ socketChannel }) {
            return { request_id: 0, result: { payload: "here" } };
          }
        },
        [call(socketClient.getRequest, 0), "TEST_ACTION"]
      ])
      .call(socketClient.getRequest, 0)
      .put({ type: "TEST_ACTION_SUCCESS", payload: { payload: "here" } })
      .run();
  });

  it("can receive a WebSocket error message", () => {});
});
