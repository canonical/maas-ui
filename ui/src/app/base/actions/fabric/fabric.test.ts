import fabric from "./fabric";

describe("fabric actions", () => {
  it("should handle fetching fabrics", () => {
    expect(fabric.fetch()).toEqual({
      type: "FETCH_FABRIC",
      meta: {
        model: "fabric",
        method: "list",
      },
    });
  });

  it("can handle creating fabrics", () => {
    expect(fabric.create({ name: "fabric1", description: "a fabric" })).toEqual(
      {
        type: "CREATE_FABRIC",
        meta: {
          model: "fabric",
          method: "create",
        },
        payload: {
          params: {
            name: "fabric1",
            description: "a fabric",
          },
        },
      }
    );
  });

  it("can handle updating fabrics", () => {
    expect(fabric.update({ name: "fabric1", description: "a fabric" })).toEqual(
      {
        type: "UPDATE_FABRIC",
        meta: {
          model: "fabric",
          method: "update",
        },
        payload: {
          params: {
            name: "fabric1",
            description: "a fabric",
          },
        },
      }
    );
  });

  it("can handle deleting fabrics", () => {
    expect(fabric.delete(1)).toEqual({
      type: "DELETE_FABRIC",
      meta: {
        model: "fabric",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("can handle cleaning fabrics", () => {
    expect(fabric.cleanup()).toEqual({
      type: "CLEANUP_FABRIC",
    });
  });
});
