import { actions } from "./";

describe("vlan actions", () => {
  it("returns an action for fetching vlans", () => {
    expect(actions.fetch()).toEqual({
      type: "vlan/fetch",
      meta: {
        model: "vlan",
        method: "list",
      },
      payload: null,
    });
  });

  it("returns an action for creating vlans", () => {
    expect(actions.create({ name: "vlan1", description: "a vlan" })).toEqual({
      type: "vlan/create",
      meta: {
        model: "vlan",
        method: "create",
      },
      payload: {
        params: {
          name: "vlan1",
          description: "a vlan",
        },
      },
    });
  });

  it("returns an action for updating vlans", () => {
    expect(actions.update({ name: "vlan1", description: "a vlan" })).toEqual({
      type: "vlan/update",
      meta: {
        model: "vlan",
        method: "update",
      },
      payload: {
        params: {
          name: "vlan1",
          description: "a vlan",
        },
      },
    });
  });

  it("returns an action for deleting vlans", () => {
    expect(actions.delete(1)).toEqual({
      type: "vlan/delete",
      meta: {
        model: "vlan",
        method: "delete",
      },
      payload: {
        params: {
          id: 1,
        },
      },
    });
  });

  it("returns an action for cleaning vlans", () => {
    expect(actions.cleanup()).toEqual({
      type: "vlan/cleanup",
    });
  });
});
