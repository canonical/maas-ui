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
});
