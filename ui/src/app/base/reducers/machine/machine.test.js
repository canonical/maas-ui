import machine from "./machine";

const STATUSES = {
  aborting: false,
  acquiring: false,
  checkingPower: false,
  commissioning: false,
  deleting: false,
  deploying: false,
  enteringRescueMode: false,
  exitingRescueMode: false,
  locking: false,
  markingBroken: false,
  markingFixed: false,
  overridingFailedTesting: false,
  releasing: false,
  settingPool: false,
  settingZone: false,
  tagging: false,
  testing: false,
  turningOff: false,
  turningOn: false,
  unlocking: false,
};

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(machine(undefined, {})).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce FETCH_MACHINE_START", () => {
    expect(
      machine(undefined, {
        type: "FETCH_MACHINE_START",
      })
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce FETCH_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, hostname: "node1" }],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
          selected: [],
          statuses: {
            abc: STATUSES,
          },
        },
        {
          type: "FETCH_MACHINE_SUCCESS",
          payload: [
            { id: 1, hostname: "node1-newname", system_id: "abc" },
            { id: 2, hostname: "node2", system_id: "def" },
          ],
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1-newname", system_id: "abc" },
        { id: 2, hostname: "node2", system_id: "def" },
      ],
      loading: true,
      loaded: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {
        abc: STATUSES,
        def: STATUSES,
      },
    });
  });

  it("should correctly reduce FETCH_MACHINE_COMPLETE", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: true,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          type: "FETCH_MACHINE_COMPLETE",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loading: false,
      loaded: true,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce FETCH_MACHINE_ERROR", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          error: "Could not fetch machines",
          type: "FETCH_MACHINE_ERROR",
        }
      )
    ).toEqual({
      errors: "Could not fetch machines",
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce GET_MACHINE_START", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
          selected: [],
        },
        {
          type: "GET_MACHINE_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: true,
      saved: true,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce GET_MACHINE_ERROR", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
          selected: [],
        },
        {
          error: { system_id: "id was not supplied" },
          type: "GET_MACHINE_ERROR",
        }
      )
    ).toEqual({
      errors: { system_id: "id was not supplied" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should update if machine exists on GET_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, name: "machine1", system_id: "abc" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { abc: STATUSES },
        },
        {
          payload: { id: 1, name: "machine1-newname", system_id: "abc" },
          type: "GET_MACHINE_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, name: "machine1-newname", system_id: "abc" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {
        abc: STATUSES,
      },
    });
  });

  it("should correctly reduce GET_MACHINE_SUCCESS", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, name: "machine1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          payload: { id: 2, name: "machine2", system_id: "abc" },
          type: "GET_MACHINE_SUCCESS",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "machine1" },
        { id: 2, name: "machine2", system_id: "abc" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {
        abc: STATUSES,
      },
    });
  });

  it("should correctly reduce CREATE_MACHINE_START", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: true,
          saving: false,
          selected: [],
        },
        {
          type: "CREATE_MACHINE_START",
        }
      )
    ).toEqual({
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: true,
      selected: [],
    });
  });

  it("should correctly reduce CREATE_MACHINE_ERROR", () => {
    expect(
      machine(
        {
          errors: {},
          items: [],
          loaded: false,
          loading: false,
          saved: false,
          saving: true,
          selected: [],
        },
        {
          error: { name: "name already exists" },
          type: "CREATE_MACHINE_ERROR",
        }
      )
    ).toEqual({
      errors: { name: "name already exists" },
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should update if machine exists on CREATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, name: "machine1", system_id: "abc" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: { abc: STATUSES },
        },
        {
          payload: { id: 1, name: "machine1-newname", system_id: "abc" },
          type: "CREATE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 1, name: "machine1-newname", system_id: "abc" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {
        abc: STATUSES,
      },
    });
  });

  it("should correctly reduce CREATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [{ id: 1, name: "machine1" }],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
          statuses: {},
        },
        {
          payload: { id: 2, name: "machine2", system_id: "abc" },
          type: "CREATE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, name: "machine1" },
        { id: 2, name: "machine2", system_id: "abc" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {
        abc: STATUSES,
      },
    });
  });

  it("should correctly reduce DELETE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { id: 1, system_id: "abc" },
            { id: 2, system_id: "def" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: ["abc"],
          statuses: { abc: {} },
        },
        {
          payload: "abc",
          type: "DELETE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [{ id: 2, system_id: "def" }],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
      statuses: {},
    });
  });

  it("should correctly reduce UPDATE_MACHINE_NOTIFY", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { id: 1, hostname: "node1" },
            { id: 2, hostname: "node2" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          payload: {
            id: 1,
            hostname: "node1v2",
          },
          type: "UPDATE_MACHINE_NOTIFY",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { id: 1, hostname: "node1v2" },
        { id: 2, hostname: "node2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: [],
    });
  });

  it("should correctly reduce CHECK_MACHINE_POWER_ERROR", () => {
    expect(
      machine(
        {
          errors: null,
          items: [],
          loaded: false,
          loading: true,
          selected: [],
          statuses: { abc: { checkingPower: true } },
        },
        {
          meta: {
            item: {
              system_id: "abc",
            },
          },
          type: "CHECK_MACHINE_POWER_ERROR",
          error: "Uh oh!",
        }
      )
    ).toEqual({
      errors: "Uh oh!",
      loading: true,
      loaded: false,
      items: [],
      selected: [],
      statuses: { abc: { checkingPower: false } },
    });
  });

  it("should correctly reduce SET_SELECTED_MACHINES", () => {
    expect(
      machine(
        {
          errors: {},
          items: [
            { system_id: "abcde", hostname: "node1" },
            { system_id: "fghij", hostname: "node2" },
          ],
          loaded: false,
          loading: false,
          saved: false,
          saving: false,
          selected: [],
        },
        {
          payload: ["abcde", "fghij"],
          type: "SET_SELECTED_MACHINES",
        }
      )
    ).toEqual({
      errors: {},
      items: [
        { system_id: "abcde", hostname: "node1" },
        { system_id: "fghij", hostname: "node2" },
      ],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      selected: ["abcde", "fghij"],
    });
  });

  describe("SET_MACHINE_POOL", () => {
    it("should correctly reduce SET_MACHINE_POOL_START", () => {
      expect(
        machine(
          {
            errors: "Uh oh",
            statuses: {
              abc: {
                settingPool: false,
              },
            },
          },
          {
            meta: {
              item: {
                system_id: "abc",
              },
            },
            type: "SET_MACHINE_POOL_START",
          }
        )
      ).toEqual({
        errors: {},
        statuses: {
          abc: {
            settingPool: true,
          },
        },
      });
    });

    it("should correctly reduce SET_MACHINE_POOL_SUCCESS", () => {
      expect(
        machine(
          {
            statuses: {
              abc: {
                settingPool: true,
              },
            },
          },
          {
            meta: {
              item: {
                system_id: "abc",
              },
            },
            type: "SET_MACHINE_POOL_SUCCESS",
          }
        )
      ).toEqual({
        statuses: {
          abc: {
            settingPool: false,
          },
        },
      });
    });

    it("should correctly reduce SET_MACHINE_POOL_ERROR", () => {
      expect(
        machine(
          {
            errors: null,
            statuses: {
              abc: {
                settingPool: false,
              },
            },
          },
          {
            meta: {
              item: {
                system_id: "abc",
              },
            },
            error: "Uh oh",
            type: "SET_MACHINE_POOL_ERROR",
          }
        )
      ).toEqual({
        errors: "Uh oh",
        statuses: {
          abc: {
            settingPool: false,
          },
        },
      });
    });
  });
});
