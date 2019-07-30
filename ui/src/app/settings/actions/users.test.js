import users from "./users";

describe("user actions", () => {
  it("should handle fetching users", () => {
    expect(users.fetch()).toEqual({
      type: "WEBSOCKET_SEND",
      payload: {
        actionType: "FETCH_USERS",
        message: {
          method: "user.list",
          type: 0
        }
      }
    });
  });
});
