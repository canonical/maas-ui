import packagerepository from "./packagerepository";

describe("packagerepository actions", () => {
  it("should handle fetching repositories", () => {
    expect(packagerepository.fetch()).toEqual({
      type: "FETCH_PACKAGEREPOSITORY",
      payload: {
        params: { limit: 50 },
      },
      meta: {
        model: "packagerepository",
        method: "list",
      },
    });
  });

  it("can handle creating repositories", () => {
    expect(packagerepository.create({ name: "foo" })).toEqual({
      type: "CREATE_PACKAGEREPOSITORY",
      meta: {
        model: "packagerepository",
        method: "create",
      },
      payload: {
        params: {
          name: "foo",
        },
      },
    });
  });

  it("can handle updating repositories", () => {
    expect(packagerepository.update({ name: "bar" })).toEqual({
      type: "UPDATE_PACKAGEREPOSITORY",
      meta: {
        model: "packagerepository",
        method: "update",
      },
      payload: {
        params: {
          name: "bar",
        },
      },
    });
  });

  it("can handle deleting repositories", () => {
    expect(packagerepository.delete(911)).toEqual({
      type: "DELETE_PACKAGEREPOSITORY",
      meta: {
        model: "packagerepository",
        method: "delete",
      },
      payload: {
        params: {
          id: 911,
        },
      },
    });
  });

  it("can handle cleaning repositories", () => {
    expect(packagerepository.cleanup()).toEqual({
      type: "CLEANUP_PACKAGEREPOSITORY",
    });
  });
});
