import { call, put, take } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";

import MESSAGE_TYPES from "app/base/constants";
import {
  createConnection,
  handleMessage,
  handleNotifyMessage,
  sendMessage,
  watchMessages,
  watchWebSockets,
} from "./websockets";
import getCookie from "./utils";
import WebSocketClient from "../../../websocket-client";

jest.mock("../../../websocket-client");

describe("websocket sagas", () => {
  let socketChannel, socketClient;

  beforeEach(() => {
    socketClient = {
      getRequest: jest.fn(),
      send: jest.fn(),
      socket: {
        onerror: jest.fn(),
      },
    };
    socketChannel = jest.fn();

    WebSocketClient.mockImplementation(() => {
      return socketClient;
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("connects to a WebSocket", () => {
    return expectSaga(watchWebSockets)
      .provide([
        [call(getCookie, "csrftoken"), "foo"],
        [call(createConnection, "foo"), {}],
      ])
      .take("WEBSOCKET_CONNECT")
      .put({
        type: "WEBSOCKET_CONNECTED",
      })
      .dispatch({
        type: "WEBSOCKET_CONNECT",
      })
      .run();
  });

  it("raises an error if no csrftoken exists", () => {
    const error = new Error(
      "No csrftoken found, please ensure you are logged into MAAS."
    );
    return expectSaga(watchWebSockets)
      .provide([
        [call(getCookie, "csrftoken"), undefined],
        [call(createConnection, "foo"), {}],
      ])
      .take("WEBSOCKET_CONNECT")
      .put({ type: "WEBSOCKET_ERROR", error: error.message })
      .dispatch({
        type: "WEBSOCKET_CONNECT",
      })
      .run();
  });

  it("can create a WebSocket connection", () => {
    expect.assertions(1);
    const socket = createConnection();
    socketClient.socket.onopen();
    return expect(socket).resolves.toEqual(socketClient);
  });

  it("can watch for WebSocket messages", () => {
    const channel = watchMessages(socketClient);
    let response;
    channel.take((val) => (response = val));
    socketClient.socket.onmessage({ data: '{"message": "secret"}' });
    expect(response).toEqual({ message: "secret" });
  });

  it("can send a WebSocket message", () => {
    const saga = sendMessage(socketClient, {
      type: "TEST_ACTION",
      meta: {
        model: "test",
        method: "method",
        type: MESSAGE_TYPES.REQUEST,
      },
      payload: {
        params: { foo: "bar" },
      },
    });
    expect(saga.next().value).toEqual(put({ type: "TEST_ACTION_START" }));
    expect(saga.next().value).toEqual(
      call([socketClient, socketClient.send], "TEST_ACTION", {
        method: "test.method",
        type: MESSAGE_TYPES.REQUEST,
        params: { foo: "bar" },
      })
    );
  });

  it("continues if data has already been fetched for list methods", () => {
    const action = {
      type: "FETCH_TEST",
      meta: {
        model: "test",
        method: "test.list",
        type: MESSAGE_TYPES.REQUEST,
      },
    };
    const previous = sendMessage(socketClient, action);
    previous.next();
    const saga = sendMessage(socketClient, action);
    // The saga should have finished.
    expect(saga.next().done).toBe(true);
  });

  it("can handle params as an array", () => {
    const saga = sendMessage(socketClient, {
      type: "TEST_ACTION",
      meta: {
        model: "test",
        method: "method",
        type: MESSAGE_TYPES.REQUEST,
      },
      payload: {
        params: [
          { name: "foo", value: "bar" },
          { name: "baz", value: "qux" },
        ],
      },
    });
    expect(saga.next().value).toEqual(put({ type: "TEST_ACTION_START" }));

    expect(saga.next().value).toEqual(
      call([socketClient, socketClient.send], "TEST_ACTION", {
        method: "test.method",
        type: MESSAGE_TYPES.REQUEST,
        params: { name: "foo", value: "bar" },
      })
    );
    expect(saga.next().value).toEqual(take("TEST_ACTION_NOTIFY"));

    expect(saga.next().value).toEqual(
      call([socketClient, socketClient.send], "TEST_ACTION", {
        method: "test.method",
        type: MESSAGE_TYPES.REQUEST,
        params: { name: "baz", value: "qux" },
      })
    );
    expect(saga.next().value).toEqual(take("TEST_ACTION_NOTIFY"));
  });

  it("can handle errors when sending a WebSocket message", () => {
    const saga = sendMessage(socketClient, {
      type: "TEST_ACTION",
      meta: {
        model: "test",
        method: "method",
        type: MESSAGE_TYPES.REQUEST,
      },
      payload: {
        params: { foo: "bar" },
      },
    });
    saga.next();
    saga.next();
    expect(saga.throw("error!").value).toEqual(
      put({ type: "TEST_ACTION_ERROR", error: "error!" })
    );
  });

  it("can handle a WebSocket response message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(
      saga.next({ request_id: 99, result: { response: "here" } }).value
    ).toEqual(call([socketClient, socketClient.getRequest], 99));
    expect(saga.next("TEST_ACTION").value).toEqual(
      put({ type: "TEST_ACTION_SUCCESS", payload: { response: "here" } })
    );
  });

  it("can handle a WebSocket error message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(
      saga.next({
        request_id: 99,
        error: '{"Message": "catastrophic failure"}',
      }).value
    ).toEqual(call([socketClient, socketClient.getRequest], 99));
    expect(saga.next("TEST_ACTION").value).toEqual(
      put({
        type: "TEST_ACTION_ERROR",
        error: { Message: "catastrophic failure" },
      })
    );
  });

  it("can handle a WebSocket error message that is not JSON", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(
      saga.next({
        request_id: 99,
        error: '("catastrophic failure")',
      }).value
    ).toEqual(call([socketClient, socketClient.getRequest], 99));
    expect(saga.next("TEST_ACTION").value).toEqual(
      put({
        type: "TEST_ACTION_ERROR",
        error: '("catastrophic failure")',
      })
    );
  });

  it("can handle a WebSocket notify message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    const response = {
      type: MESSAGE_TYPES.NOTIFY,
      name: "config",
      action: "update",
      data: { name: "foo", value: "bar" },
    };
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(saga.next(response).value).toEqual(
      call(handleNotifyMessage, response)
    );
    // yield no further, take a new message
    expect(saga.next().value).toEqual(take(socketChannel));
  });

  it("can handle a WebSocket close message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(saga.next({ type: "close" }).value).toEqual(
      put({ type: "WEBSOCKET_DISCONNECTED" })
    );
  });

  it("can handle a WebSocket error message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(saga.next({ type: "error", message: "Timeout" }).value).toEqual(
      put({ type: "WEBSOCKET_ERROR", error: "Timeout" })
    );
  });

  it("can handle a WebSocket open message", () => {
    const saga = handleMessage(socketChannel, socketClient);
    expect(saga.next().value).toEqual(take(socketChannel));
    expect(saga.next({ type: "open" }).value).toEqual(
      put({ type: "WEBSOCKET_CONNECTED" })
    );
  });
});
