import { connectWebSocket } from "./actions";

describe("base actions", () => {
  it("should handle connection to a WebSocket", () => {
    expect(connectWebSocket()).toEqual({
      type: "WEBSOCKET_CONNECT"
    });
  });
});
