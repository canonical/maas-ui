import WebSocketClient from "./websocket-client";

class MockSocket {
  constructor() {
    this.send = jest.fn();
  }
}

describe("websocket client", () => {
  let client, windowWebsocket;

  beforeAll(() => {
    windowWebsocket = window.WebSocket;
  });

  beforeEach(() => {
    window.WebSocket = MockSocket;
    client = new WebSocketClient("ws://example.com/ws");
  });

  afterAll(() => {
    window.WebSocket = windowWebsocket;
  });

  it("can send a message", () => {
    client.send("TEST_ACTION", { method: "packagerepository.list" });
    expect(client.socket.send.mock.calls.length).toBe(1);
    expect(JSON.parse(client.socket.send.mock.calls[0][0])).toEqual({
      method: "packagerepository.list",
      request_id: 0
    });
  });

  it("increments the id", () => {
    expect(client._nextId).toBe(0);
    client.send("TEST_ACTION", {});
    expect(client._nextId).toBe(1);
    client.send("TEST_ACTION", {});
    expect(client._nextId).toBe(2);
  });

  it("can get a stored request", () => {
    client.send("TEST_ACTION", {});
    expect(client.getRequest(0)).toEqual("TEST_ACTION");
  });
});
