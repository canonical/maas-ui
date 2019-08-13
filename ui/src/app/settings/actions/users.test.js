import users from "./users";

describe("user actions", () => {
  it("should handle fetching users", () => {
    expect(users.fetch()).toEqual({
      type: "FETCH_USERS",
      payload: {
        message: {
          method: "user.list",
          type: 0
        }
      }
    });
  });
});
