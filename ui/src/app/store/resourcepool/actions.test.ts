import { actions } from "./";

describe("resourcepool actions", () => {
  it("returns an action for fetching resource pools", () => {
    expect(actions.fetch()).toEqual({
      type: "resourcepool/fetch",
      meta: {
        model: "resourcepool",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns an action for creating resource pools", () => {
    expect(actions.create({ name: "pool1", description: "a pool" })).toEqual({
      type: "resourcepool/create",
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

  it("returns an action for updating resource pools", () => {
    expect(
      actions.update({ name: "newName", description: "new description" })
    ).toEqual({
      type: "resourcepool/update",
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

  it("returns an action for deleting resource pools", () => {
    expect(actions.delete(808)).toEqual({
      type: "resourcepool/delete",
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

  it("returns an action for cleaning resource pools", () => {
    expect(actions.cleanup()).toEqual({
      type: "resourcepool/cleanup",
    });
  });

  it("returns an action for creating resource pools with machines", () => {
    expect(
      actions.createWithMachines({ name: "pool1" }, ["machine1", "machine2"])
    ).toEqual({
      type: "resourcepool/createWithMachines",
      payload: {
        params: {
          pool: {
            name: "pool1",
          },
          machines: ["machine1", "machine2"],
        },
      },
    });
  });
});
