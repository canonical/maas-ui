import { connectWebSocket, fetchAuthUser } from "./actions";

describe("base actions", () => {
  it("should handle connection to a WebSocket", () => {
    expect(connectWebSocket()).toEqual({
      type: "WEBSOCKET_CONNECT"
    });
  });

  it("should handle fetching the current user", () => {
    expect(fetchAuthUser()).toEqual({
      type: "FETCH_AUTH_USER",
      meta: {
        model: "user",
        method: "auth_user"
      }
    });
  });
});
