import { connectWebSocket, fetchAuthUser } from "./actions";

describe("base actions", () => {
  it("should handle connection to a WebSocket", () => {
    expect(connectWebSocket()).toEqual({
      type: "WEBSOCKET_CONNECT"
    });
  });

  it("should handle fetching the current user", () => {
    expect(fetchAuthUser()).toEqual({
      type: "WEBSOCKET_SEND",
      payload: {
        actionType: "FETCH_AUTH_USER",
        message: {
          method: "user.auth_user",
          type: 0
        }
      }
    });
  });
});
