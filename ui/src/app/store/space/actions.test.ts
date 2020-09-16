import { actions } from "./";

describe("space actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "space/fetch",
      meta: {
        model: "space",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(actions.create({ name: "space1", description: "a space" })).toEqual({
      type: "space/create",
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

  it("returns an update action", () => {
    expect(actions.update({ name: "space1", description: "a space" })).toEqual({
      type: "space/update",
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

  it("returns a delete action", () => {
    expect(actions.delete(1)).toEqual({
      type: "space/delete",
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

  it("returns a cleanup action", () => {
    expect(actions.cleanup()).toEqual({
      type: "space/cleanup",
      payload: undefined,
    });
  });
});
