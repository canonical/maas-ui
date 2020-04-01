import websocket from "./websocket";

describe("base actions", () => {
  it("should handle connection to a WebSocket", () => {
    expect(websocket.connect()).toEqual({
      type: "WEBSOCKET_CONNECT",
    });
  });
});
