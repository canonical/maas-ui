import { actions } from "./slice";

describe("sslkey actions", () => {
  it("should handle fetching SSL keys", () => {
    expect(actions.fetch()).toEqual({
      type: "sslkey/fetch",
      meta: {
        model: "sslkey",
        method: "list",
      },
      payload: null,
    });
  });

  it("can handle creating SSL keys", () => {
    expect(actions.create({ key: "---begin cert---..." })).toEqual({
      type: "sslkey/create",
      meta: {
        model: "sslkey",
        method: "create",
      },
      payload: {
        params: {
          key: "---begin cert---...",
        },
      },
    });
  });

  it("can handle deleting SSL keys", () => {
    expect(actions.delete(808)).toEqual({
      type: "sslkey/delete",
      meta: {
        model: "sslkey",
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
    expect(actions.cleanup()).toEqual({
      type: "sslkey/cleanup",
    });
  });
});
