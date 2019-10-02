import sslkey from "./sslkey";

describe("sslkey actions", () => {
  it("should handle fetching SSL keys", () => {
    expect(sslkey.fetch()).toEqual({
      type: "FETCH_SSLKEY",
      meta: {
        model: "sslkey",
        method: "list"
      }
    });
  });

  it("can handle creating SSL keys", () => {
    expect(sslkey.create({ key: "---begin cert---..." })).toEqual({
      type: "CREATE_SSLKEY",
      meta: {
        model: "sslkey",
        method: "create"
      },
      payload: {
        params: {
          key: "---begin cert---..."
        }
      }
    });
  });

  it("can handle deleting SSL keys", () => {
    expect(sslkey.delete(808)).toEqual({
      type: "DELETE_SSLKEY",
      meta: {
        model: "sslkey",
        method: "delete"
      },
      payload: {
        params: {
          id: 808
        }
      }
    });
  });

  it("can clean up", () => {
    expect(sslkey.cleanup()).toEqual({
      type: "CLEANUP_SSLKEY"
    });
  });
});
