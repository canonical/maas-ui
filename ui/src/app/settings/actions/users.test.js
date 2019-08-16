import users from "./users";

describe("user actions", () => {
  it("should handle fetching users", () => {
    expect(users.fetch()).toEqual({
      type: "FETCH_USERS",
      meta: {
        model: "users",
        method: "user.list",
        type: 0
      }
    });
  });
});
