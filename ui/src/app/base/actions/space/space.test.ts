import space from "./space";

describe("space actions", () => {
  it("should handle fetching spaces", () => {
    expect(space.fetch()).toEqual({
      type: "FETCH_SPACE",
      meta: {
        model: "space",
        method: "list",
      },
    });
  });

  it("can handle creating spaces", () => {
    expect(space.create({ name: "space1", description: "a space" })).toEqual({
      type: "CREATE_SPACE",
      meta: {
        model: "space",
        method: "create",
      },
      payload: {
        params: {
          name: "space1",
          description: "a space",
        },
      },
    });
  });

  it("can handle updating spaces", () => {
    expect(space.update({ name: "space1", description: "a space" })).toEqual({
      type: "UPDATE_SPACE",
      meta: {
        model: "space",
        method: "update",
      },
      payload: {
        params: {
          name: "space1",
          description: "a space",
        },
      },
    });
  });

  it("can handle deleting spaces", () => {
    expect(space.delete(1)).toEqual({
      type: "DELETE_SPACE",
      meta: {
        model: "space",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can handle cleaning spaces", () => {
    expect(space.cleanup()).toEqual({
      type: "CLEANUP_SPACE",
    });
  });
});
