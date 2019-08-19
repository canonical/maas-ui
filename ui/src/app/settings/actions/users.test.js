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

  it("can handle creating users", () => {
    expect(users.create({ name: "kangaroo" })).toEqual({
      type: "CREATE_USERS",
      meta: {
        model: "users",
        method: "user.create",
        type: 0
      },
      payload: {
        params: {
          name: "kangaroo"
        }
      }
    });
  });

  it("can handle updating users", () => {
    expect(users.update({ name: "kookaburra" })).toEqual({
      type: "UPDATE_USERS",
      meta: {
        model: "users",
        method: "user.update",
        type: 0
      },
      payload: {
        params: {
          name: "kookaburra"
        }
      }
    });
  });

  it("can handle cleaning users", () => {
    expect(users.cleanup({ name: "kookaburra" })).toEqual({
      type: "CLEANUP_USERS"
    });
  });
});
