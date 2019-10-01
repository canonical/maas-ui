import user from "./user";

describe("user actions", () => {
  it("should handle fetching users", () => {
    expect(user.fetch()).toEqual({
      type: "FETCH_USER",
      meta: {
        model: "user",
        method: "list"
      }
    });
  });

  it("can handle creating users", () => {
    expect(user.create({ name: "kangaroo" })).toEqual({
      type: "CREATE_USER",
      meta: {
        model: "user",
        method: "create"
      },
      payload: {
        params: {
          name: "kangaroo"
        }
      }
    });
  });

  it("can handle updating users", () => {
    expect(user.update({ name: "kookaburra" })).toEqual({
      type: "UPDATE_USER",
      meta: {
        model: "user",
        method: "update"
      },
      payload: {
        params: {
          name: "kookaburra"
        }
      }
    });
  });

  it("can handle deleting users", () => {
    expect(user.delete(808)).toEqual({
      type: "DELETE_USER",
      meta: {
        model: "user",
        method: "delete"
      },
      payload: {
        params: {
          id: 808
        }
      }
    });
  });

  it("can handle cleaning users", () => {
    expect(user.cleanup()).toEqual({
      type: "CLEANUP_USER"
    });
  });
});
