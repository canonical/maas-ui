import { actions } from "./slice";

describe("subnet actions", () => {
  it("returns a fetch action", () => {
    expect(actions.fetch()).toEqual({
      type: "subnet/fetch",
      meta: {
        model: "subnet",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns a create action", () => {
    expect(
      actions.create({ name: "subnet1", description: "a subnet" })
    ).toEqual({
      type: "subnet/create",
      meta: {
        model: "subnet",
        method: "create",
      },
      payload: {
        params: {
          name: "subnet1",
          description: "a subnet",
        },
      },
    });
  });

  it("returns an update action", () => {
    expect(
      actions.update({ name: "subnet1", description: "a subnet" })
    ).toEqual({
      type: "subnet/update",
      meta: {
        model: "subnet",
        method: "update",
      },
      payload: {
        params: {
          name: "subnet1",
          description: "a subnet",
        },
      },
    });
  });

  it("returns a delete action", () => {
    expect(actions.delete(1)).toEqual({
      type: "subnet/delete",
      meta: {
        model: "subnet",
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
      type: "subnet/cleanup",
      payload: undefined,
    });
  });
});
