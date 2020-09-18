import { actions } from "./slice";

describe("user actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "user/fetch",
      meta: {
        model: "user",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(actions.create({ name: "user1", description: "a user" })).toEqual({
      type: "user/create",
      meta: {
        model: "user",
        method: "create",
      },
      payload: {
        params: {
          name: "user1",
          description: "a user",
        },
      },
    });
  });

  it("returns an update action", () => {
    expect(actions.update({ name: "user1", description: "a user" })).toEqual({
      type: "user/update",
      meta: {
        model: "user",
        method: "update",
      },
      payload: {
        params: {
          name: "user1",
          description: "a user",
        },
      },
    });
  });

  it("returns a delete action", () => {
    expect(actions.delete(1)).toEqual({
      type: "user/delete",
      meta: {
        model: "user",
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
      type: "user/cleanup",
      payload: undefined,
    });
  });
});
