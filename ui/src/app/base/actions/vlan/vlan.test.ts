import vlan from "./vlan";

describe("vlan actions", () => {
  it("should handle fetching vlans", () => {
    expect(vlan.fetch()).toEqual({
      type: "FETCH_VLAN",
      meta: {
        model: "vlan",
        method: "list",
      },
    });
  });

  it("can handle creating vlans", () => {
    expect(vlan.create({ name: "vlan1", description: "a vlan" })).toEqual({
      type: "CREATE_VLAN",
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

  it("can handle updating vlans", () => {
    expect(vlan.update({ name: "vlan1", description: "a vlan" })).toEqual({
      type: "UPDATE_VLAN",
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

  it("can handle deleting vlans", () => {
    expect(vlan.delete(1)).toEqual({
      type: "DELETE_VLAN",
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

  it("can handle cleaning vlans", () => {
    expect(vlan.cleanup()).toEqual({
      type: "CLEANUP_VLAN",
    });
  });
});
