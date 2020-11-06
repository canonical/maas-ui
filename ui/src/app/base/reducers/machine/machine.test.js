import machine from "./machine";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
} from "testing/factories";

describe("machine reducer", () => {
  it("should return the initial state", () => {
    expect(machine(undefined, {})).toEqual({
      active: null,
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
    const initialState = machineStateFactory({ loading: false });

    expect(
      machine(initialState, {
        type: "FETCH_MACHINE_START",
      })
    ).toEqual(
      machineStateFactory({
        loading: true,
      })
    );
  });

  it("should correctly reduce FETCH_MACHINE_SUCCESS", () => {
    const initialState = machineStateFactory({
      items: [],
      loading: true,
      loaded: false,
      statuses: {},
    });
    const fetchedMachines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];

    expect(
      machine(initialState, {
        type: "FETCH_MACHINE_SUCCESS",
        payload: fetchedMachines,
      })
    ).toEqual(
      machineStateFactory({
        items: fetchedMachines,
        loading: true,
        loaded: false,
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("should correctly reduce FETCH_MACHINE_COMPLETE", () => {
    const initialState = machineStateFactory({
      loaded: false,
      loading: true,
    });

    expect(machine(initialState, { type: "FETCH_MACHINE_COMPLETE" })).toEqual(
      machineStateFactory({
        loaded: true,
        loading: false,
      })
    );
  });

  it("should correctly reduce FETCH_MACHINE_ERROR", () => {
    const initialState = machineStateFactory({
      errors: null,
      loaded: false,
      loading: true,
    });

    expect(
      machine(initialState, {
        error: "Could not fetch machines",
        type: "FETCH_MACHINE_ERROR",
      })
    ).toEqual(
      machineStateFactory({
        errors: "Could not fetch machines",
        loaded: false,
        loading: false,
      })
    );
  });

  it("should correctly reduce GET_MACHINE_START", () => {
    const initialState = machineStateFactory({ loading: false });

    expect(
      machine(initialState, {
        type: "GET_MACHINE_START",
      })
    ).toEqual(machineStateFactory({ loading: true }));
  });

  it("should correctly reduce GET_MACHINE_ERROR", () => {
    const initialState = machineStateFactory({ errors: null, loading: true });

    expect(
      machine(initialState, {
        error: { system_id: "id was not supplied" },
        type: "GET_MACHINE_ERROR",
      })
    ).toEqual(
      machineStateFactory({
        errors: { system_id: "id was not supplied" },
        loading: false,
      })
    );
  });

  it("should update if machine exists on GET_MACHINE_SUCCESS", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ system_id: "abc123", name: "machine1" })],
      loading: false,
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const updatedMachine = machineDetailsFactory({
      system_id: "abc123",
      name: "machine1-newname",
    });

    expect(
      machine(initialState, {
        payload: updatedMachine,
        type: "GET_MACHINE_SUCCESS",
      })
    ).toEqual(
      machineStateFactory({
        items: [updatedMachine],
        loading: false,
        statuses: {
          abc123: machineStatusFactory(),
        },
      })
    );
  });

  it("should correctly reduce GET_MACHINE_SUCCESS", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ system_id: "abc123" })],
      loading: true,
      statuses: {
        abc123: machineStatusFactory(),
      },
    });
    const newMachine = machineDetailsFactory({ system_id: "def456" });

    expect(
      machine(initialState, {
        payload: newMachine,
        type: "GET_MACHINE_SUCCESS",
      })
    ).toEqual(
      machineStateFactory({
        items: [...initialState.items, newMachine],
        loading: false,
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("should correctly reduce SET_ACTIVE_MACHINE_SUCCESS", () => {
    const initialState = machineStateFactory({ active: null });

    expect(
      machine(initialState, {
        payload: machineDetailsFactory({ system_id: "abc123" }),
        type: "SET_ACTIVE_MACHINE_SUCCESS",
      })
    ).toEqual(machineStateFactory({ active: "abc123" }));
  });

  it("should correctly reduce SET_ACTIVE_MACHINE_ERROR", () => {
    const initialState = machineStateFactory({
      active: "abc123",
      errors: null,
    });

    expect(
      machine(initialState, {
        error: "Machine does not exist",
        type: "SET_ACTIVE_MACHINE_ERROR",
      })
    ).toEqual(
      machineStateFactory({ active: null, errors: "Machine does not exist" })
    );
  });

  it("should correctly reduce CREATE_MACHINE_START", () => {
    const initialState = machineStateFactory({ saved: true, saving: false });

    expect(
      machine(initialState, {
        type: "CREATE_MACHINE_START",
      })
    ).toEqual(
      machineStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce CREATE_MACHINE_ERROR", () => {
    const initialState = machineStateFactory({
      errors: null,
      saved: false,
      saving: true,
    });

    expect(
      machine(initialState, {
        error: { name: "name already exists" },
        type: "CREATE_MACHINE_ERROR",
      })
    ).toEqual(
      machineStateFactory({
        errors: { name: "name already exists" },
        saved: false,
        saving: false,
      })
    );
  });

  it("should update if machine exists on CREATE_MACHINE_NOTIFY", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ id: 1, name: "machine1", system_id: "abc123" })],
      statuses: { abc123: machineStatusFactory() },
    });
    const updatedMachine = machineFactory({
      id: 1,
      name: "machine1-newname",
      system_id: "abc123",
    });

    expect(
      machine(initialState, {
        payload: updatedMachine,
        type: "CREATE_MACHINE_NOTIFY",
      })
    ).toEqual(
      machineStateFactory({
        items: [updatedMachine],
        statuses: {
          abc123: machineStatusFactory(),
        },
      })
    );
  });

  it("should correctly reduce CREATE_MACHINE_NOTIFY", () => {
    const initialState = machineStateFactory({
      items: [machineFactory({ id: 1, system_id: "abc123" })],
      statuses: { abc123: machineStatusFactory() },
    });
    const newMachine = machineFactory({ id: 2, system_id: "def456" });

    expect(
      machine(initialState, {
        payload: newMachine,
        type: "CREATE_MACHINE_NOTIFY",
      })
    ).toEqual(
      machineStateFactory({
        items: [...initialState.items, newMachine],
        statuses: {
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        },
      })
    );
  });

  it("should correctly reduce DELETE_MACHINE_NOTIFY", () => {
    const initialState = machineStateFactory({
      items: [
        machineFactory({ system_id: "abc123" }),
        machineFactory({ system_id: "def456" }),
      ],
      selected: ["abc123"],
      statuses: {
        abc123: machineStatusFactory(),
        def456: machineStatusFactory(),
      },
    });

    expect(
      machine(initialState, {
        payload: "abc123",
        type: "DELETE_MACHINE_NOTIFY",
      })
    ).toEqual(
      machineStateFactory({
        items: [initialState.items[1]],
        selected: [],
        statuses: { def456: machineStatusFactory() },
      })
    );
  });

  it("should correctly reduce UPDATE_MACHINE_NOTIFY", () => {
    const initialState = machineStateFactory({
      items: [
        machineFactory({ id: 1, system_id: "abc123", hostname: "node1" }),
        machineFactory({ id: 2, system_id: "def456", hostname: "node2" }),
      ],
    });
    const updatedMachine = machineFactory({
      id: 1,
      system_id: "abc123",
      hostname: "node1v2",
    });

    expect(
      machine(initialState, {
        payload: updatedMachine,
        type: "UPDATE_MACHINE_NOTIFY",
      })
    ).toEqual(
      machineStateFactory({
        items: [updatedMachine, initialState.items[1]],
      })
    );
  });

  it("should correctly reduce CHECK_MACHINE_POWER_ERROR", () => {
    const initialState = machineStateFactory({
      statuses: { abc123: machineStatusFactory({ checkingPower: true }) },
    });

    expect(
      machine(initialState, {
        meta: {
          item: {
            system_id: "abc123",
          },
        },
        type: "CHECK_MACHINE_POWER_ERROR",
        error: "Uh oh!",
      })
    ).toEqual(
      machineStateFactory({
        errors: "Uh oh!",
        statuses: { abc123: machineStatusFactory({ checkingPower: false }) },
      })
    );
  });

  it("should correctly reduce SET_SELECTED_MACHINES", () => {
    const initialState = machineStateFactory({ selected: [] });

    expect(
      machine(initialState, {
        payload: ["abcde", "fghij"],
        type: "SET_SELECTED_MACHINES",
      })
    ).toEqual(
      machineStateFactory({
        selected: ["abcde", "fghij"],
      })
    );
  });

  describe("SET_MACHINE_POOL", () => {
    it("should correctly reduce SET_MACHINE_POOL_START", () => {
      const initialState = machineStateFactory({
        statuses: { abc123: machineStatusFactory({ settingPool: false }) },
      });

      expect(
        machine(initialState, {
          meta: {
            item: {
              system_id: "abc123",
            },
          },
          type: "SET_MACHINE_POOL_START",
        })
      ).toEqual(
        machineStateFactory({
          statuses: {
            abc123: machineStatusFactory({
              settingPool: true,
            }),
          },
        })
      );
    });

    it("should correctly reduce SET_MACHINE_POOL_SUCCESS", () => {
      const initialState = machineStateFactory({
        statuses: { abc123: machineStatusFactory({ settingPool: true }) },
      });

      expect(
        machine(initialState, {
          meta: {
            item: {
              system_id: "abc123",
            },
          },
          type: "SET_MACHINE_POOL_SUCCESS",
        })
      ).toEqual(
        machineStateFactory({
          statuses: {
            abc123: machineStatusFactory({
              settingPool: false,
            }),
          },
        })
      );
    });

    it("should correctly reduce SET_MACHINE_POOL_ERROR", () => {
      const initialState = machineStateFactory({
        errors: null,
        statuses: { abc123: machineStatusFactory({ settingPool: true }) },
      });

      expect(
        machine(initialState, {
          meta: {
            item: {
              system_id: "abc123",
            },
          },
          error: "Uh oh",
          type: "SET_MACHINE_POOL_ERROR",
        })
      ).toEqual(
        machineStateFactory({
          errors: "Uh oh",
          statuses: {
            abc123: machineStatusFactory({
              settingPool: false,
            }),
          },
        })
      );
    });
  });

  it("should correctly reduce UPDATE_MACHINE_START", () => {
    const initialState = machineStateFactory({ saved: true, saving: false });

    expect(
      machine(initialState, {
        type: "UPDATE_MACHINE_START",
      })
    ).toEqual(
      machineStateFactory({
        saved: false,
        saving: true,
      })
    );
  });

  it("should correctly reduce CREATE_MACHINE_ERROR", () => {
    const initialState = machineStateFactory({
      errors: {},
      loading: true,
      saving: true,
    });

    expect(
      machine(initialState, {
        error: "Uh oh",
        type: "CREATE_MACHINE_ERROR",
      })
    ).toEqual(
      machineStateFactory({
        errors: "Uh oh",
        loading: false,
        saving: false,
      })
    );
  });
});
