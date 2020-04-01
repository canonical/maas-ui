import token from "./token";

describe("token actions", () => {
  it("should handle fetching tokens", () => {
    expect(token.fetch()).toEqual({
      type: "FETCH_TOKEN",
      meta: {
        model: "token",
        method: "list",
      },
    });
  });

  it("can handle creating tokens", () => {
    expect(token.create({ key: "---begin cert---..." })).toEqual({
      type: "CREATE_TOKEN",
      meta: {
        model: "token",
        method: "create",
      },
      payload: {
        params: {
          key: "---begin cert---...",
        },
      },
    });
  });

  it("can handle deleting tokens", () => {
    expect(token.delete(808)).toEqual({
      type: "DELETE_TOKEN",
      meta: {
        model: "token",
        method: "delete",
      },
      payload: {
        params: {
          id: 808,
        },
      },
    });
  });

  it("can clean up", () => {
    expect(token.cleanup()).toEqual({
      type: "CLEANUP_TOKEN",
    });
  });
});
