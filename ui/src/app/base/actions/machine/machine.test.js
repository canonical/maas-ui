import machine from "./machine";

describe("machine actions", () => {
  it("should handle fetching machines", () => {
    expect(machine.fetch()).toEqual({
      type: "FETCH_MACHINE",
      meta: {
        model: "machine",
        method: "list"
      }
    });
  });

  it("can handle creating machines", () => {
    expect(
      machine.create({ name: "machine1", description: "a machine" })
    ).toEqual({
      type: "CREATE_MACHINE",
      meta: {
        model: "machine",
        method: "create"
      },
      payload: {
        params: {
          name: "machine1",
          description: "a machine"
        }
      }
    });
  });

  it("can handle setting the pool", () => {
    expect(machine.setPool("abc123", 909)).toEqual({
      type: "SET_MACHINE_POOL",
      meta: {
        model: "machine",
        method: "action"
      },
      payload: {
        params: {
          action: "set-pool",
          extra: {
            pool_id: 909
          },
          system_id: "abc123"
        }
      }
    });
  });

  it("can handle setting the zone", () => {
    expect(machine.setZone("abc123", 909)).toEqual({
      type: "SET_MACHINE_ZONE",
      meta: {
        model: "machine",
        method: "action"
      },
      payload: {
        params: {
          action: "set-zone",
          extra: {
            zone_id: 909
          },
          system_id: "abc123"
        }
      }
    });
  });

  it("can handle cleaning machines", () => {
    expect(machine.cleanup()).toEqual({
      type: "CLEANUP_MACHINE"
    });
  });
});
