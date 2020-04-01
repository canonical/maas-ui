import resourcepool from "./resourcepool";

describe("resourcepool actions", () => {
  it("should handle fetching resource pools", () => {
    expect(resourcepool.fetch()).toEqual({
      type: "FETCH_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "list",
      },
    });
  });

  it("can handle creating resource pools", () => {
    expect(
      resourcepool.create({ name: "pool1", description: "a pool" })
    ).toEqual({
      type: "CREATE_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "create",
      },
      payload: {
        params: {
          name: "pool1",
          description: "a pool",
        },
      },
    });
  });

  it("can handle updating resource pools", () => {
    expect(
      resourcepool.update({ name: "newName", description: "new description" })
    ).toEqual({
      type: "UPDATE_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "update",
      },
      payload: {
        params: {
          name: "newName",
          description: "new description",
        },
      },
    });
  });

  it("can handle deleting resource pools", () => {
    expect(resourcepool.delete(808)).toEqual({
      type: "DELETE_RESOURCEPOOL",
      meta: {
        model: "resourcepool",
        method: "delete",
      },
      payload: {
        params: {
          id: 808,
        },
      },
    });
  });

  it("can handle cleaning resource pools", () => {
    expect(resourcepool.cleanup()).toEqual({
      type: "CLEANUP_RESOURCEPOOL",
    });
  });
});
