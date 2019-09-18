import resourcepool from "./resourcepool";

describe("resourcepool actions", () => {
  it("should handle fetching resource pools", () => {
    expect(resourcepool.fetch()).toEqual({
      type: "FETCH_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "list"
      }
    });
  });
});
