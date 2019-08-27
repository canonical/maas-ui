import { connectWebSocket, messages, fetchAuthUser } from "./actions";

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

  it("should handle adding a message", () => {
    expect(messages.add("User added", "negative", "Error", true)).toEqual({
      type: "ADD_MESSAGE",
      payload: {
        id: 1,
        message: "User added",
        status: "Error",
        temporary: true,
        type: "negative"
      }
    });
  });

  it("should handle removing a message", () => {
    expect(messages.remove(1)).toEqual({
      type: "REMOVE_MESSAGE",
      payload: 1
    });
  });
});
