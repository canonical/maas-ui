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

  it("can handle deleting resource pools", () => {
    expect(resourcepool.delete(808)).toEqual({
      type: "DELETE_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "delete"
      },
      payload: {
        params: {
          id: 808
        }
      }
    });
  });

  it("can handle cleaning resource pools", () => {
    expect(resourcepool.cleanup()).toEqual({
      type: "CLEANUP_RESOURCEPOOL"
    });
  });
});
