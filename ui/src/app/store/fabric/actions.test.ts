import { actions } from "./slice";

describe("fabric actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "fabric/fetch",
      meta: {
        model: "fabric",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(
      actions.create({ name: "fabric1", description: "a fabric" })
    ).toEqual({
      type: "fabric/create",
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
    });
  });

  it("returns an update action", () => {
    expect(
      actions.update({ name: "fabric1", description: "a fabric" })
    ).toEqual({
      type: "fabric/update",
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
    });
  });

  it("returns a delete action", () => {
    expect(actions.delete(1)).toEqual({
      type: "fabric/delete",
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

  it("returns a cleanup action", () => {
    expect(actions.cleanup()).toEqual({
      type: "fabric/cleanup",
      payload: undefined,
    });
  });
});
