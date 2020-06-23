import getCookie from "app/utils";
import WebSocketClient from "./websocket-client";
import { WebSocket } from "mock-socket";

jest.mock("./app/base/sagas/utils");

describe("websocket client", () => {
  let client, windowWebsocket;

  beforeAll(() => {
    windowWebsocket = window.WebSocket;
  });

  beforeEach(() => {
    window.WebSocket = WebSocket;
    getCookie.mockImplementation(() => "abc123");
    client = new WebSocketClient("ws://example.com/ws");
    client.connect();
    client.socket.send = jest.fn();
  });

  afterAll(() => {
    window.WebSocket = windowWebsocket;
  });

  it("throws an error if the csrftoken does not exist", () => {
    getCookie.mockImplementation(() => null);
    const client2 = new WebSocketClient("ws://example.com/ws");
    expect(client2.connect).toThrow();
  });

  it("can send a message", () => {
    client.send("TEST_ACTION", { method: "packagerepository.list" });
    expect(client.socket.send.mock.calls.length).toBe(1);
    expect(JSON.parse(client.socket.send.mock.calls[0][0])).toEqual({
      method: "packagerepository.list",
      request_id: 0,
    });
  });

  it("increments the id", () => {
    expect(client.send("TEST_ACTION", {})).toBe(0);
    expect(client.send("TEST_ACTION", {})).toBe(1);
  });

  it("can get a stored request", () => {
    client.send("TEST_ACTION", {});
    expect(client.getRequest(0)).toEqual("TEST_ACTION");
  });
});
